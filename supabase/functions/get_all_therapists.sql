-- RPC function to get all therapists (pending + approved) with user data for admin dashboard
CREATE OR REPLACE FUNCTION get_all_therapists()
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
