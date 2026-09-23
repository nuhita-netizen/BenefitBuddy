-- Run this in your Supabase SQL Editor

-- 1. Create the Users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT auth.uid() PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT,
    income NUMERIC,
    state TEXT,
    category TEXT,
    occupation TEXT,
    land_holding NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Add new columns to existing Schemes table
ALTER TABLE public.schemes 
ADD COLUMN IF NOT EXISTS benefit_type TEXT,
ADD COLUMN IF NOT EXISTS benefit_amount_min NUMERIC,
ADD COLUMN IF NOT EXISTS benefit_amount_max NUMERIC,
ADD COLUMN IF NOT EXISTS frequency TEXT,
ADD COLUMN IF NOT EXISTS required_documents JSONB;

-- 3. Create the Insurance Plans table
CREATE TABLE IF NOT EXISTS public.insurance_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    provider_name TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    type TEXT,
    cover_amount NUMERIC,
    premium_annual NUMERIC,
    tenure_years INTEGER,
    claim_settlement_ratio NUMERIC,
    is_government BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Fix RLS for the new table
ALTER TABLE public.insurance_plans DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.insurance_plans TO anon;
