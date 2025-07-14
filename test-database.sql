-- Test to check what data is actually in the database
-- Run this in your Supabase SQL Editor to see the real data structure

-- Check users table structure and sample data
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check therapist_profiles table structure  
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'therapist_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check sample users data (first 3 rows)
SELECT id, email, name, role, phone, photo_url, location, created_at
FROM users 
LIMIT 3;

-- Check sample therapist_profiles data (first 3 rows)
SELECT id, user_id, bio, specialties, credentials, experience_years, availability, hourly_rate, is_approved
FROM therapist_profiles 
LIMIT 3;

-- Test the JOIN query we're using in the RPC function
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
    u.role::text
FROM therapist_profiles tp
INNER JOIN users u ON tp.user_id = u.id
LIMIT 2;
