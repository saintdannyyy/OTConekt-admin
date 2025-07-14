import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'

// Only validate environment variables at runtime, not during build
if (typeof window !== 'undefined' || (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1')) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase service role key: SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
  }
}

// Regular client for authentication and basic operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
