import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktmpaddijvfhokucwnuy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bXBhZGRpanZmaG9rdWN3bnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MTg2NDIsImV4cCI6MjA2ODk5NDY0Mn0.NWywC6jsp3Ayvvk7aMUF_XwQO-v-Pklh3-sSSgFIfcE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 