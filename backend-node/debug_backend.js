import { supabase } from './src/supabaseClient.js';

async function test() {
    try {
        console.log("1. Creating user...");
        const res = await fetch('http://127.0.0.1:8000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test Bug",
                age: 10,
                gender: "female",
                income: 150000,
                state: "Maharashtra",
                category: "General",
                occupation: "student",
                land_holding: 0
            })
        });
        const userData = await res.json();
        
        if (!res.ok) {
            console.log("Error creating user:", userData);
            return;
        }

        const userId = userData.id;
        console.log("User created:", userId);

        console.log("2. Checking eligibility...");
        const eligRes = await fetch(`http://127.0.0.1:8000/eligibility/check/${userId}`, { method: 'POST' });
        const eligData = await eligRes.json();
        
        if (!eligRes.ok) {
            console.log("Error checking eligibility:", eligData);
            return;
        }
        
        console.log("Eligibility checked. Returned count:", eligData.length);

        console.log("3. Getting insurance plans...");
        const insRes = await fetch('http://127.0.0.1:8000/insurance');
        const insData = await insRes.json();
        
        if (!insRes.ok) {
            console.log("Error getting insurance:", insData);
            return;
        }
        
        console.log("Insurance fetched. Returned count:", insData.length);
        
    } catch (e) {
        console.log("===== ERROR CAUGHT =====");
        console.log(e);
    }
}
test();
