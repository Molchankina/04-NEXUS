const SUPABASE_URL="https://folqcnkieqtiwptvylyl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_HqDIZrWadkZvWP5oDkbTrg_W2VO_2tQ";
window.NEXUS_SUPABASE_URL = SUPABASE_URL;
window.NEXUS_SUPABASE_KEY = SUPABASE_PUBLISHABLE_KEY;
window.supabase = window.supabase.createClient(
    window.NEXUS_SUPABASE_URL,
    window.NEXUS_SUPABASE_KEY
);