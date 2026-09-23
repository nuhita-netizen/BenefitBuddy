import { supabase } from './src/supabaseClient.js';

async function patch() {
    console.log("Patching National Pension Scheme...");
    const { data, error } = await supabase
        .from('schemes')
        .update({ target_occupation: 'government employee' })
        .eq('name', 'National Pension Scheme');

    if (error) {
        console.error("Failed to patch:", error);
    } else {
        console.log("Patch applied successfully!");
    }
}
patch();
