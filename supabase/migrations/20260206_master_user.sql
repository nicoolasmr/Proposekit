-- Create master user role and set unlimited credits for nicoolascf55@gmail.com

-- 1. Add is_master column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'is_master'
    ) THEN
        ALTER TABLE users ADD COLUMN is_master BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 2. Set master user (will be set when user logs in via trigger)
-- We'll create a function to automatically set master status on login

-- 3. Create or replace function to check if user is master
CREATE OR REPLACE FUNCTION is_master_user(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN user_email = 'nicoolascf55@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger to set master status on user creation/update
CREATE OR REPLACE FUNCTION set_master_user_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this is the master email
    IF NEW.email = 'nicoolascf55@gmail.com' THEN
        NEW.is_master := TRUE;
        -- Set unlimited credits (using a very high number)
        NEW.credits_balance := 999999;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_set_master_user ON users;
CREATE TRIGGER trigger_set_master_user
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_master_user_status();

-- 5. Update existing user if they exist
UPDATE users 
SET 
    is_master = TRUE,
    credits_balance = 999999
WHERE email = 'nicoolascf55@gmail.com';

-- 6. Modify release_proposal function to skip credit check for master users
DROP FUNCTION IF EXISTS public.release_proposal(uuid);

CREATE OR REPLACE FUNCTION public.release_proposal(target_proposal_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  v_user_credits int;
  v_is_master boolean;
  PROPOSAL_COST CONSTANT int := 1;
BEGIN
  -- 1. Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Unauthorized');
  END IF;

  -- 2. Check if user is master
  SELECT is_master, credits_balance INTO v_is_master, v_user_credits
  FROM users
  WHERE id = v_user_id;

  -- 3. Skip credit check for master users
  IF NOT COALESCE(v_is_master, FALSE) THEN
    -- Regular user: check credits
    IF v_user_credits IS NULL OR v_user_credits < PROPOSAL_COST THEN
      RETURN jsonb_build_object(
        'error', 'Insufficient credits',
        'needsPurchase', true,
        'currentBalance', COALESCE(v_user_credits, 0)
      );
    END IF;

    -- Deduct credits for regular users
    UPDATE users
    SET credits_balance = credits_balance - PROPOSAL_COST
    WHERE id = v_user_id;
  END IF;

  -- 4. Mark proposal as released
  UPDATE proposals
  SET 
    status = 'released',
    released_at = NOW()
  WHERE id = target_proposal_id
    AND user_id = v_user_id;

  -- 5. Record consumption event (even for master, for tracking)
  INSERT INTO credit_events (user_id, proposal_id, type, amount, metadata)
  VALUES (
    v_user_id,
    target_proposal_id,
    'consume',
    CASE WHEN v_is_master THEN 0 ELSE -PROPOSAL_COST END,
    jsonb_build_object(
      'action', 'release_proposal',
      'is_master', COALESCE(v_is_master, FALSE)
    )
  );

  RETURN jsonb_build_object(
    'success', true, 
    'newBalance', CASE 
      WHEN v_is_master THEN 999999 
      ELSE v_user_credits - PROPOSAL_COST 
    END,
    'is_master', COALESCE(v_is_master, FALSE)
  );
END;
$function$;

-- 7. Add comment for documentation
COMMENT ON COLUMN users.is_master IS 'Master user with unlimited credits and special privileges';
