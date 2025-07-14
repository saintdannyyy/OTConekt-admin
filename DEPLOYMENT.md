# OTConekt Admin Dashboard - Deployment Checklist

## Environment Variables to Set in Vercel

Make sure these environment variables are set in your Vercel project settings:

### Required Environment Variables

1. **NEXT_PUBLIC_SUPABASE_URL**

   - Value: Your Supabase project URL (e.g., `https://your-project.supabase.co`)
   - Found in: Supabase Dashboard → Settings → API

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**

   - Value: Your Supabase anonymous/public key
   - Found in: Supabase Dashboard → Settings → API

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Value: Your Supabase service role key (secret key)
   - Found in: Supabase Dashboard → Settings → API
   - ⚠️ **Warning**: This is a secret key with admin privileges

## Database Setup

### 1. Deploy the RPC Function

Execute this SQL in your Supabase SQL Editor:

```sql
-- Function to get all therapists with user info for admin
CREATE OR REPLACE FUNCTION getadmin_all_therapists()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  bio TEXT,
  specializations TEXT[],
  experience_years INTEGER,
  education TEXT[],
  certifications TEXT[],
  license_number TEXT,
  license_state TEXT,
  consultation_fee DECIMAL,
  availability_hours JSONB,
  is_approved BOOLEAN,
  profile_picture_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  user_created_at TIMESTAMPTZ,
  user_updated_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT
    tp.id,
    u.full_name,
    u.email,
    u.phone,
    u.date_of_birth,
    tp.bio,
    tp.specializations,
    tp.experience_years,
    tp.education,
    tp.certifications,
    tp.license_number,
    tp.license_state,
    tp.consultation_fee,
    tp.availability_hours,
    tp.is_approved,
    tp.profile_picture_url,
    tp.created_at,
    tp.updated_at,
    u.created_at as user_created_at,
    u.updated_at as user_updated_at
  FROM therapist_profiles tp
  JOIN users u ON tp.id = u.id
  ORDER BY tp.created_at DESC;
$$;
```

### 2. Set RLS Policies (if needed)

Ensure your service role key can access the necessary tables.

## Build & Deployment Status

### Recent Fixes Applied:

✅ **Environment Variable Handling**: Updated `lib/supabase.ts` to handle build-time gracefully
✅ **Dynamic Rendering**: Added `export const dynamic = 'force-dynamic'` to all pages
✅ **Next.js Configuration**: Updated `next.config.js` with proper settings
✅ **Function Naming**: Updated to use `getadmin_all_therapists` everywhere

### If Build Still Fails:

1. **Check Environment Variables**: Ensure all three environment variables are properly set in Vercel
2. **Verify RPC Function**: Make sure the `getadmin_all_therapists` function is deployed in Supabase
3. **Check Permissions**: Verify your service role key has the necessary permissions
4. **Test Locally**: Run `npm run build` locally to test the build process

## Local Development

1. Create a `.env.local` file with your environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

## Features

- **User Management**: View and manage all registered users
- **Therapist Management**: Approve/reject therapist applications
- **Dashboard Analytics**: View platform statistics and metrics
- **Responsive Design**: Works on desktop and mobile devices

## Troubleshooting

If you encounter build errors:

1. Check that all pages with Supabase calls have `export const dynamic = 'force-dynamic'`
2. Verify environment variables are available at build time
3. Ensure the Supabase RPC function is properly deployed
4. Check that your service role key has admin permissions
