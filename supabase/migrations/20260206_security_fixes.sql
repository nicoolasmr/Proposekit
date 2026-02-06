-- Security Fix: Restrict proposal_acceptances INSERT
DROP POLICY IF EXISTS "Public can insert acceptances" ON proposal_acceptances;
CREATE POLICY "Public can insert acceptances" ON proposal_acceptances
    FOR INSERT
    WITH CHECK (
        -- Option 1: Must be authenticated
        auth.role() = 'authenticated'
        OR
        -- Option 2: Allow public IF they have a valid proposal ID
        EXISTS (
            SELECT 1 FROM proposals 
            WHERE id = proposal_acceptances.proposal_id 
            AND status = 'released' -- Only allow accepting released proposals
        )
    );

-- Performance: Add missing indexes on Foreign Keys
CREATE INDEX IF NOT EXISTS idx_change_requests_proposal_id ON change_requests(proposal_id);
CREATE INDEX IF NOT EXISTS idx_change_requests_user_id ON change_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_followup_templates_user_id ON followup_templates(user_id);

-- Security: Fix mutable search_path on function
-- DROP first to allow return type change if needed (though we aren't changing it effectively, postgres is strict)
DROP FUNCTION IF EXISTS public.release_proposal(uuid);

CREATE OR REPLACE FUNCTION public.release_proposal(target_proposal_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public' -- FIX: Set search_path
AS $function$
DECLARE
  v_user_id uuid;
  v_user_credits int;
  PROPOSAL_COST CONSTANT int := 1;
BEGIN
  -- 1. Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Unauthorized');
  END IF;

  -- 2. Check current credits
  SELECT credits_balance INTO v_user_credits
  FROM users
  WHERE id = v_user_id;

  IF v_user_credits IS NULL OR v_user_credits < PROPOSAL_COST THEN
    RETURN jsonb_build_object(
      'error', 'Insufficient credits',
      'needsPurchase', true,
      'currentBalance', COALESCE(v_user_credits, 0)
    );
  END IF;

  -- 3. Deduct credits (atomic update)
  UPDATE users
  SET credits_balance = credits_balance - PROPOSAL_COST
  WHERE id = v_user_id;

  -- 4. Mark proposal as released
  UPDATE proposals
  SET 
    status = 'released',
    released_at = NOW()
  WHERE id = target_proposal_id
    AND user_id = v_user_id; -- Ensure ownership

  -- 5. Record consumption event
  INSERT INTO credit_events (user_id, proposal_id, type, amount, metadata)
  VALUES (
    v_user_id,
    target_proposal_id,
    'consume',
    -PROPOSAL_COST,
    jsonb_build_object('action', 'release_proposal')
  );

  RETURN jsonb_build_object(
    'success', true, 
    'newBalance', v_user_credits - PROPOSAL_COST
  );
END;
$function$;
