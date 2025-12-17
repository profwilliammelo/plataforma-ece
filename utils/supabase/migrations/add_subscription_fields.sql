-- Migration: Add Subscription Fields to 'perfis'
-- Author: Antigravity
-- Date: 2025-12-15

-- 1. Add new columns to 'perfis'
alter table perfis 
add column if not exists plano text default 'free',
add column if not exists stripe_customer_id text,
add column if not exists stripe_subscription_id text,
add column if not exists limite_mensal int default 2,
add column if not exists planos_gerados_mes int default 0,
add column if not exists data_renovacao timestamp with time zone;

-- 2. Create index for faster lookup by Stripe ID
create index if not exists idx_perfis_stripe_customer_id on perfis(stripe_customer_id);

-- 3. Policy updates (if necessary) - Users can read their own plan info (already covered by select policy)

-- 4. Function to reset monthly limits (Can be called by cron later)
create or replace function reset_monthly_limits()
returns void as $$
begin
  update perfis 
  set planos_gerados_mes = 0 
  where data_renovacao < now();
end;
$$ language plpgsql;
