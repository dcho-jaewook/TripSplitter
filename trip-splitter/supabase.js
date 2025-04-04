import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://dgwxdyydzpxofvhljojw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnd3hkeXlkenB4b2Z2aGxqb2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NTU5MTEsImV4cCI6MjA1OTIzMTkxMX0._uazokx2f_O1t0WVBfmXUtFPe4GdyX5xSDYsAq30XQk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});