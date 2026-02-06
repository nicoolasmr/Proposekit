
-- Migration: Add ai_content column to proposals table
-- Date: 2026-02-06

ALTER TABLE proposals ADD COLUMN IF NOT EXISTS ai_content jsonb;
