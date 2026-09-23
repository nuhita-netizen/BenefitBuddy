-- Disable RLS to allow inserts
ALTER TABLE public.schemes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Clear old data
TRUNCATE TABLE public.schemes RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.insurance_plans RESTART IDENTITY CASCADE;

-- Insert Schemes
INSERT INTO public.schemes (name, description, min_age, max_age, target_gender, max_income, target_state, target_category, target_occupation, benefit_type, benefit_amount_min, benefit_amount_max, frequency, required_documents) VALUES
('PM-KISAN', 'Direct income support for farmers', NULL, NULL, NULL, 200000, NULL, 'general, obc, sc, st', 'farmer', 'Cash Transfer', 6000, 6000, 'Annual', '["Aadhaar Card", "Land holding papers", "Bank Account Details"]'::jsonb),
('PMAY', 'Housing for All - urban and rural', 18, NULL, NULL, 600000, NULL, 'general, obc, sc, st', NULL, 'Housing Subsidy', 150000, 267000, 'One-time', '["Aadhaar Card", "Income Certificate", "Affidavit of no pucca house"]'::jsonb),
('Sukanya Samriddhi Yojana', 'Girl Child Prosperity Scheme', NULL, 10, 'female', NULL, NULL, NULL, NULL, 'High-Interest Savings', 250, 150000, 'Annual Deposit Limit', '["Birth Certificate", "Aadhaar Card of Parent"]'::jsonb),
('National Pension Scheme', 'Retirement savings for all citizens', 18, 65, NULL, NULL, NULL, NULL, 'government employee', 'Pension', NULL, NULL, 'Monthly upon retirement', '["Aadhaar Card", "PAN Card", "Bank Details"]'::jsonb);

-- Insert Insurance Plans
INSERT INTO public.insurance_plans (provider_name, plan_name, type, cover_amount, premium_annual, tenure_years, claim_settlement_ratio, is_government) VALUES
('LIC', 'Kanyadan Policy', 'Life', 2500000, 45000, 21, 98.6, false),
('SBI Life', 'eShield Next', 'Term', 10000000, 12000, 30, 99.1, false),
('HDFC Ergo', 'Optima Restore', 'Health', 1000000, 15000, 1, 97.8, false),
('Star Health', 'Family Health Optima', 'Health', 500000, 18000, 1, 90.0, false),
('Government of India', 'PMJJBY', 'Life', 200000, 436, 1, 99.9, true),
('Government of India', 'PMSBY', 'Accident', 200000, 20, 1, 99.9, true);
