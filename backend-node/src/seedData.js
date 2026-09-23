import { supabase } from './supabaseClient.js';

async function seedDatabase() {
    console.log("Clearing existing data...");
    await supabase.from('schemes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('insurance_plans').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const schemes = [
        {
            name: "PM-KISAN",
            description: "Pradhan Mantri Kisan Samman Nidhi",
            max_land_acres: 5.0, 
            target_occupation: "farmer",
            benefit_type: "Cash Transfer",
            benefit_amount_min: 6000,
            benefit_amount_max: 6000,
            frequency: "Annual",
            required_documents: ["Aadhaar Card", "Land Records (7/12)", "Bank Passbook"]
        },
        {
            name: "Ayushman Bharat",
            description: "National Health Protection Scheme",
            max_income: 500000,
            benefit_type: "Health Cover",
            benefit_amount_min: 500000,
            benefit_amount_max: 500000,
            frequency: "Annual",
            required_documents: ["Aadhaar Card", "Ration Card", "Income Certificate"]
        },
        {
            name: "PMAY",
            description: "Pradhan Mantri Awas Yojana",
            min_age: 18,
            max_income: 1800000,
            benefit_type: "Housing Subsidy",
            benefit_amount_min: 267000,
            benefit_amount_max: 267000,
            frequency: "One-time",
            required_documents: ["Aadhaar Card", "Income Proof", "Bank Statement"]
        },
        {
            name: "Sukanya Samriddhi Yojana",
            description: "Girl Child Prosperity Scheme",
            max_age: 10,
            target_gender: "female",
            benefit_type: "High-Interest Savings",
            benefit_amount_min: 250,
            benefit_amount_max: 150000,
            frequency: "Annual Deposit Limit",
            required_documents: ["Birth Certificate", "Aadhaar Card of Parent"]
        },
        {
            name: "SC/ST Scholarship",
            description: "Pre-Matric Scholarship for SC/ST students",
            min_age: 10,
            max_age: 16,
            target_category: "sc,st",
            benefit_type: "Education Subsidy",
            benefit_amount_min: 2250,
            benefit_amount_max: 3000,
            frequency: "Annual",
            required_documents: ["Caste Certificate", "Income Certificate", "School ID"]
        }
    ];

    const insurancePlans = [
        { provider_name: "Govt of India", plan_name: "Ayushman Bharat", type: "Health", cover_amount: 500000, premium_annual: 0, tenure_years: 1, claim_settlement_ratio: 95.5, is_government: true },
        { provider_name: "LIC", plan_name: "Jeevan Arogya", type: "Health", cover_amount: 500000, premium_annual: 8500, tenure_years: 1, claim_settlement_ratio: 98.2, is_government: false },
        { provider_name: "Govt of India", plan_name: "PMJJBY", type: "Life", cover_amount: 200000, premium_annual: 436, tenure_years: 1, claim_settlement_ratio: 99.1, is_government: true },
        { provider_name: "HDFC Life", plan_name: "Click 2 Protect", type: "Life", cover_amount: 10000000, premium_annual: 12500, tenure_years: 30, claim_settlement_ratio: 99.4, is_government: false },
        { provider_name: "Govt of India", plan_name: "PMSBY", type: "Accident", cover_amount: 200000, premium_annual: 20, tenure_years: 1, claim_settlement_ratio: 96.3, is_government: true },
        { provider_name: "Star Health", plan_name: "Family Optima", type: "Health", cover_amount: 1000000, premium_annual: 15400, tenure_years: 1, claim_settlement_ratio: 90.1, is_government: false }
    ];

    const { error: insertSchemesError } = await supabase.from('schemes').insert(schemes);
    if (insertSchemesError) console.error("Failed to insert schemes:", insertSchemesError.message);
    else console.log("Successfully seeded schemes.");

    const { error: insertInsuranceError } = await supabase.from('insurance_plans').insert(insurancePlans);
    if (insertInsuranceError) console.error("Failed to insert insurance plans:", insertInsuranceError.message);
    else console.log("Successfully seeded insurance plans.");

    process.exit(0);
}

seedDatabase();
