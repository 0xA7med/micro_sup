import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://jwizdetcrrcwvylctuuj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3aXpkZXRjcnJjd3Z5bGN0dXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzODc4NzAsImV4cCI6MjA0OTk2Mzg3MH0.FhZQ8VV0SeC0loLcyY7HR7g5CUe5aJ_k_eI4Xjnl26c';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
