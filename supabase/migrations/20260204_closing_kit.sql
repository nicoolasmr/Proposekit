-- Closing Kit Migration
-- Created at 2026-02-04
-- Amended: Removed 'templates' table handling as it does not exist.

-- 1. Feature Flags
CREATE TABLE IF NOT EXISTS feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  key text NOT NULL,
  enabled boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, key)
);
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own feature flags" ON feature_flags;
CREATE POLICY "Users can view their own feature flags" ON feature_flags
  FOR SELECT USING (auth.uid() = user_id);

-- 2. Alter Proposals
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS mode text;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS closing_enabled boolean DEFAULT false;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS status_v2 text DEFAULT 'draft';
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS deposit_required boolean DEFAULT false;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS deposit_type text DEFAULT 'percent'; -- 'percent' | 'fixed'
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS deposit_value numeric;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS pix_key text;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS pix_receiver_name text;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS pix_receiver_document text;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS public_title text;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS paid_at timestamp with time zone;

-- 3. Proposal Acceptances
CREATE TABLE IF NOT EXISTS proposal_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) NOT NULL,
  accepted_by_name text NOT NULL,
  accepted_by_email text NOT NULL,
  accepted_by_role text,
  accepted_at timestamp with time zone DEFAULT now(),
  acceptance_ip text,
  acceptance_user_agent text
);
ALTER TABLE proposal_acceptances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view acceptances for their proposals" ON proposal_acceptances;
CREATE POLICY "Users can view acceptances for their proposals" ON proposal_acceptances
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM proposals WHERE id = proposal_acceptances.proposal_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Public can insert acceptances" ON proposal_acceptances;
-- Allow public insert if they know the proposal_id
CREATE POLICY "Public can insert acceptances" ON proposal_acceptances
  FOR INSERT WITH CHECK (true);

-- 4. Deposits
CREATE TABLE IF NOT EXISTS deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) NOT NULL,
  type text NOT NULL, -- 'percent' | 'fixed'
  amount numeric NOT NULL,
  status text DEFAULT 'pending', -- pending | paid | canceled
  method text DEFAULT 'pix_manual', -- pix_manual | pix_provider
  pix_payload text,
  pix_qr_url text,
  created_at timestamp with time zone DEFAULT now(),
  paid_at timestamp with time zone
);
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view deposits for their proposals" ON deposits;
CREATE POLICY "Users can view deposits for their proposals" ON deposits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM proposals WHERE id = deposits.proposal_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert deposits for their proposals" ON deposits;
CREATE POLICY "Users can insert deposits for their proposals" ON deposits
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM proposals WHERE id = deposits.proposal_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update deposits for their proposals" ON deposits;
CREATE POLICY "Users can update deposits for their proposals" ON deposits
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM proposals WHERE id = deposits.proposal_id AND user_id = auth.uid())
  );

-- 5. Change Requests (Anti-Escopo)
CREATE TABLE IF NOT EXISTS change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  proposal_id uuid REFERENCES proposals(id) NOT NULL,
  title text NOT NULL,
  reason text,
  added_scope jsonb, -- description, etc.
  added_pricing jsonb,
  added_terms jsonb,
  added_total numeric,
  status text DEFAULT 'draft',
  share_id text UNIQUE,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own change requests" ON change_requests;
CREATE POLICY "Users can view their own change requests" ON change_requests
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own change requests" ON change_requests;
CREATE POLICY "Users can insert their own change requests" ON change_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own change requests" ON change_requests;
CREATE POLICY "Users can update their own change requests" ON change_requests
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can view change requests via share_id" ON change_requests;
CREATE POLICY "Public can view change requests via share_id" ON change_requests
  FOR SELECT USING (true);

-- 6. Followup Templates
CREATE TABLE IF NOT EXISTS followup_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  event_key text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE followup_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD their own followup templates" ON followup_templates;
CREATE POLICY "Users can CRUD their own followup templates" ON followup_templates
  FOR ALL USING (auth.uid() = user_id);
