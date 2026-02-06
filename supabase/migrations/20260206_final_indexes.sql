-- Performance: Add remaining missing indexes
CREATE INDEX IF NOT EXISTS idx_credit_events_proposal_id ON credit_events(proposal_id);
CREATE INDEX IF NOT EXISTS idx_deposits_proposal_id ON deposits(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_acceptances_proposal_id ON proposal_acceptances(proposal_id);
