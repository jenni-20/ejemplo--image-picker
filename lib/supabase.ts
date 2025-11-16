import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://irlofepsondzihykdvoz.supabase.co";
const supabasePublishableKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlybG9mZXBzb25kemloeWtkdm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTI0NjUsImV4cCI6MjA3ODM2ODQ2NX0.PwZJf2MvTh8bg2DVez3fhihehc8KBSNGllgSUbRCdFQ"

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})