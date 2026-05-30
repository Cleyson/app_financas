-- Run this in Supabase SQL Editor to improve query performance

-- Covers: filter by user + date range (dashboard and transactions list)
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON public.transactions (user_id, date DESC);

-- Covers: filter by user + type (receita/despesa)
CREATE INDEX IF NOT EXISTS idx_transactions_user_type
  ON public.transactions (user_id, type);

-- Covers: ordering by created_at within a user
CREATE INDEX IF NOT EXISTS idx_transactions_user_created
  ON public.transactions (user_id, created_at DESC);
