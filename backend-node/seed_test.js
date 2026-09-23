import { supabase } from './src/supabaseClient.js';
async function seed() {
    const scheme = {
        name: 'Test Scheme',
        description: 'Test',
        benefit_type: 'Cash'
    };
    const { data, error } = await supabase.from('schemes').insert([scheme]);
    console.log("Insert scheme:", data, error);
}
seed();
