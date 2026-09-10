// Configuração pública do Supabase da Algartempo
// A Publishable key pode estar no frontend.
// NUNCA colocar aqui uma Secret / Service Role key.

const SUPABASE_URL = "https://rwkbcdquqpclgbtiqngd.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_dFV4fBy9ZAQwtZnNyp4TyA_WiUWRhpR";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// Disponibiliza também no objeto window para páginas como o My Algartempo.
window.supabaseClient = supabaseClient;