# Vercel Deployment Checklist for OTConekt Admin Dashboard

## Required Environment Variables

Add these environment variables in your Vercel project settings:

### 1. Go to Vercel Dashboard

- Open your project in Vercel
- Go to Settings → Environment Variables

### 2. Add the following variables:

**NEXT_PUBLIC_SUPABASE_URL**

```
https://your-project-id.supabase.co
```

**NEXT_PUBLIC_SUPABASE_ANON_KEY**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**SUPABASE_SERVICE_ROLE_KEY**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. How to find these values:

1. **Supabase URL & Anon Key**:

   - Go to your Supabase project dashboard
   - Settings → API
   - Copy "Project URL" and "anon public" key

2. **Service Role Key**:
   - Same page (Settings → API)
   - Copy "service_role" key (this is secret, don't expose publicly)

### 4. Environment Variable Settings in Vercel:

- Set all variables for **Production**, **Preview**, and **Development** environments
- Make sure NEXT*PUBLIC*\* variables are marked as "Expose to frontend"
- SUPABASE_SERVICE_ROLE_KEY should NOT be exposed to frontend

### 5. Deploy the Supabase Function:

Before deploying to Vercel, make sure to run this SQL in your Supabase SQL Editor:

```sql
-- RPC function to get all therapists (pending + approved) with user data for admin dashboard
CREATE OR REPLACE FUNCTION getadmin_all_therapists()
RETURNS TABLE (
  therapist_id uuid,
  user_id uuid,
  bio text,
  specialties text[],
  credentials text,
  experience_years integer,
  availability jsonb,
  hourly_rate numeric,
  is_approved boolean,
  created_at timestamptz,
  updated_at timestamptz,
  name text,
  email text,
  phone text,
  photo_url text,
  location text,
  role text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    tp.id as therapist_id,
    tp.user_id,
    tp.bio,
    tp.specialties,
    tp.credentials,
    tp.experience_years,
    tp.availability,
    tp.hourly_rate,
    tp.is_approved,
    tp.created_at,
    tp.updated_at,
    u.name,
    u.email,
    u.phone,
    u.photo_url,
    u.location,
    u.role
  FROM therapist_profiles tp
  INNER JOIN users u ON tp.user_id = u.id
  ORDER BY tp.created_at DESC;
$$;
```

### 6. Redeploy:

After adding environment variables, trigger a new deployment in Vercel.

## Common Issues:

1. **"Missing Supabase environment variables" error**:

   - Check that all 3 environment variables are set
   - Verify variable names are exact (case-sensitive)
   - Make sure variables are set for the correct environment (Production/Preview/Development)

2. **RPC function not found error**:

   - Run the SQL function creation in Supabase SQL Editor
   - Check that the function name matches exactly: `getadmin_all_therapists`

3. **Permission denied errors**:
   - Verify SUPABASE_SERVICE_ROLE_KEY is correct
   - Check that the service role key has admin permissions
