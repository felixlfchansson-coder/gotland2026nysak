const supabaseUrl = "https://xeretvarnzfrplzljkvt.supabase.co";
const supabaseKey = "sb_publishable_aePOQWv07JVNYuqoUzeNlA_KIwvjMnX";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

window.supabaseClient = supabaseClient;