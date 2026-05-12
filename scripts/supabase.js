const supabaseUrl = "https://xeretvarnzfrplzljkvt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcmV0dmFybnpmcnBsemxqa3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzMwNTQsImV4cCI6MjA5NDAwOTA1NH0.e-kEnEVEEnmSeBMdq6K2SCY6VxvOUnppGy5HL2Psd-I";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

window.supabaseClient = supabaseClient;