import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xsbsgdyebzfgslmmihps.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYnNnZHllYnpmZ3NsbW1paHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTI1MTksImV4cCI6MjA4OTA4ODUxOX0.m_8ExX7xkSX18rgsLufiPnL8N9WoAvwgGtqErpKMAro';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
