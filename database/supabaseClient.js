import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ciohvzrufasinkoanest.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpb2h2enJ1ZmFzaW5rb2FuZXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDQ5NzIsImV4cCI6MjA2MjcyMDk3Mn0.JtYzNcuegSYLcstuBcwkk2gqI0Ah7idRqoRdWvtE0DY';
export const supabase = createClient(supabaseUrl, supabaseKey);
