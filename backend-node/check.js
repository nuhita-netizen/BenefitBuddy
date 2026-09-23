import { supabase } from './src/supabaseClient.js';
async function test() {
    const { data, error } = await supabase.from('schemes').select('id, name');
    console.log(data, error);
}
test();
