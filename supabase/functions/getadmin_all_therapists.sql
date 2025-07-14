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
    tp.specialties,  -- Note: schema shows this as ARRAY (text[])
    tp.credentials,
    tp.experience_years,
    tp.availability, -- Note: schema shows this as jsonb
    tp.hourly_rate,  -- Note: schema shows this as numeric
    tp.is_approved,
    tp.created_at,
    tp.updated_at,
    u.name,         -- Note: schema shows this as text NOT NULL
    u.email,
    u.phone,
    u.photo_url,    -- Note: schema shows this as text
    u.location,
    u.role::text    -- Note: schema shows this as USER-DEFINED type
  FROM therapist_profiles tp
  INNER JOIN users u ON tp.user_id = u.id
  ORDER BY tp.created_at DESC;
$$;
