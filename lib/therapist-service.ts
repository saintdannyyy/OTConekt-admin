import { supabaseAdmin } from '@/lib/supabase'

// Raw response type from the RPC function
export interface RawTherapistResponse {
  therapist_id: string
  user_id: string
  bio: string | null
  specialties: string[] | null
  credentials: string | null
  experience_years: number | null
  availability: any | null
  hourly_rate: number | null
  is_approved: boolean
  created_at: string
  updated_at: string
  name: string | null
  email: string | null
  phone: string | null
  photo_url: string | null
  location: string | null
  role: string | null
}

// Enhanced TherapistProfile type for admin dashboard
export interface AdminTherapistProfile {
  // Therapist profile data
  id: string
  user_id: string
  bio: string
  specialties: string[]
  credentials: string
  experience_years: number
  availability: any
  hourly_rate: string
  is_approved: boolean
  created_at: string
  updated_at: string

  // User data (flattened for easier access)
  name: string
  email: string
  phone: string | null
  photo_url: string | null
  location: string | null
  role: string

  // Nested user object for compatibility
  users?: {
    id: string
    name: string
    email: string
    phone: string | null
    photo_url: string | null
    location: string | null
    role: string
  }
}

export class TherapistService {
  /**
   * Fetch all therapists (pending + approved) for admin dashboard
   */
  static async getAllTherapists(): Promise<AdminTherapistProfile[]> {
    try {
      console.log('🔄 Starting admin therapist data fetch at:', new Date().toISOString())

      // STEP 1: Fetch all therapist profiles with user data using SQL JOIN
      console.log('📋 Fetching all therapist profiles with user data via get_all_therapists...')
      const { data: therapistProfiles, error: queryError } = await supabaseAdmin
        .rpc('get_all_therapists', {})

      if (queryError) {
        console.error('❌ Therapist profiles fetch error:', JSON.stringify(queryError, null, 2))
        throw new Error(`Failed to fetch therapist profiles: ${queryError.message}`)
      }

      console.log(`✅ Found ${therapistProfiles?.length || 0} therapist profiles`)

      // Type the response properly
      const rawProfiles = therapistProfiles as RawTherapistResponse[] | null

      // Debugging check: Log the raw response
      if (rawProfiles && rawProfiles.length > 0) {
        console.log('📊 Raw therapist profiles response:', JSON.stringify(rawProfiles[0], null, 2))
        console.log('🔍 User IDs found:', rawProfiles.map(p => p.user_id))
        console.log('🔑 Available fields in response:', Object.keys(rawProfiles[0]))
      } else {
        console.warn('⚠️ No therapist profiles found in database')
        
        // Additional check: Verify table counts for debugging
        const { count: therapistCount, error: therapistCountError } = await supabaseAdmin
          .from('therapist_profiles')
          .select('id', { count: 'exact', head: true })
        const { count: userCount, error: userCountError } = await supabaseAdmin
          .from('users')
          .select('id', { count: 'exact', head: true })

        console.log(`🔍 Total therapist profiles count: ${therapistCount || 0}`)
        if (therapistCountError) console.error('❌ Therapist count error:', JSON.stringify(therapistCountError, null, 2))
        console.log(`🔍 Users count: ${userCount || 0}`)
        if (userCountError) console.error('❌ User count error:', JSON.stringify(userCountError, null, 2))
        
        return []
      }

      // STEP 2: Map the joined data to the AdminTherapistProfile structure
      console.log('🔗 Processing therapist profiles...')
      const enrichedTherapists: AdminTherapistProfile[] = rawProfiles
        .map((therapist, index) => {
          // Log raw therapist data for debugging
          console.log(`🔍 Processing therapist ${index + 1} raw data:`, JSON.stringify(therapist, null, 2))

          // Check for missing user data
          if (!therapist.name || therapist.name === null) {
            console.warn(`⚠️ Missing user data for therapist profile ${therapist.therapist_id} (user_id: ${therapist.user_id})`)
            return null
          }

          // Create merged object with all necessary data
          const enrichedTherapist: AdminTherapistProfile = {
            // Therapist profile data
            id: therapist.therapist_id,
            user_id: therapist.user_id,
            bio: therapist.bio || '',
            specialties: therapist.specialties || [],
            credentials: therapist.credentials || '',
            experience_years: therapist.experience_years || 0,
            availability: therapist.availability || [],
            hourly_rate: therapist.hourly_rate?.toString() || '0',
            is_approved: therapist.is_approved || false,
            created_at: therapist.created_at || new Date().toISOString(),
            updated_at: therapist.updated_at || new Date().toISOString(),

            // User data (flattened for easier access)
            name: therapist.name || 'Licensed Therapist',
            email: therapist.email || '',
            phone: therapist.phone || null,
            photo_url: therapist.photo_url || null,
            location: therapist.location || null,
            role: therapist.role || 'therapist',

            // Nested user object for backward compatibility
            users: {
              id: therapist.user_id,
              name: therapist.name || 'Unknown',
              email: therapist.email || '',
              phone: therapist.phone || null,
              photo_url: therapist.photo_url || null,
              location: therapist.location || null,
              role: therapist.role || 'therapist'
            }
          }

          console.log(`✅ Successfully processed therapist: ${enrichedTherapist.name}`)
          return enrichedTherapist
        })
        .filter((therapist): therapist is AdminTherapistProfile => therapist !== null)

      console.log(`✅ Successfully processed ${enrichedTherapists.length} therapist profiles`)

      // Final debugging check
      if (enrichedTherapists.length > 0) {
        console.log('📊 Sample merged profile:', {
          id: enrichedTherapists[0].id,
          name: enrichedTherapists[0].name,
          specialties: enrichedTherapists[0].specialties,
          location: enrichedTherapists[0].location,
          hourly_rate: enrichedTherapists[0].hourly_rate,
          is_approved: enrichedTherapists[0].is_approved
        })
      } else {
        console.warn('⚠️ No valid therapist profiles after processing')
        console.log('🔍 Checking for null user data in profiles:', 
          rawProfiles.filter(t => !t.name || t.name === null).map(t => ({
            therapist_id: t.therapist_id,
            user_id: t.user_id
          }))
        )
      }

      // Additional debugging: Check for data integrity
      const profilesWithMissingData = enrichedTherapists.filter(t => 
        !t.name || t.name === 'Licensed Therapist'
      )

      if (profilesWithMissingData.length > 0) {
        console.warn(`⚠️ ${profilesWithMissingData.length} profiles have missing user data`)
      }

      return enrichedTherapists

    } catch (error) {
      console.error('💥 Critical error loading therapists:', JSON.stringify(error, null, 2))

      // Enhanced error debugging
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }

      throw error
    } finally {
      console.log('🏁 Admin therapist data fetch completed')
    }
  }

  /**
   * Approve a therapist
   */
  static async approveTherapist(therapistId: string): Promise<void> {
    try {
      console.log(`✅ Approving therapist: ${therapistId}`)
      
      const { error } = await supabaseAdmin
        .from('therapist_profiles')
        .update({ 
          is_approved: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', therapistId)

      if (error) throw error
      
      console.log(`✅ Successfully approved therapist: ${therapistId}`)
    } catch (error) {
      console.error(`❌ Error approving therapist ${therapistId}:`, error)
      throw error
    }
  }

  /**
   * Reject a therapist
   */
  static async rejectTherapist(therapistId: string): Promise<void> {
    try {
      console.log(`❌ Rejecting therapist: ${therapistId}`)
      
      const { error } = await supabaseAdmin
        .from('therapist_profiles')
        .update({ 
          is_approved: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', therapistId)

      if (error) throw error
      
      console.log(`✅ Successfully rejected therapist: ${therapistId}`)
    } catch (error) {
      console.error(`❌ Error rejecting therapist ${therapistId}:`, error)
      throw error
    }
  }

  /**
   * Get therapist statistics for dashboard
   */
  static async getTherapistStats(): Promise<{
    total: number
    approved: number
    pending: number
    rejected: number
  }> {
    try {
      const { data: stats, error } = await supabaseAdmin
        .from('therapist_profiles')
        .select('is_approved')

      if (error) throw error

      const total = stats?.length || 0
      const approved = stats?.filter(s => s.is_approved === true).length || 0
      const pending = stats?.filter(s => s.is_approved === false).length || 0
      const rejected = 0 // We don't have a rejected status, only pending

      return { total, approved, pending, rejected }
    } catch (error) {
      console.error('❌ Error fetching therapist stats:', error)
      throw error
    }
  }
}
