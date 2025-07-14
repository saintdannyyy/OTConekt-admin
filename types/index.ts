export interface TherapistProfile {
  id: string
  user_id: string
  bio: string
  specialties: string[]
  credentials: string
  experience_years: number
  availability: any
  hourly_rate: number
  is_approved: boolean
  created_at: string
  updated_at: string
  test_title?: string
  // Joined user data
  users?: {
    id: string
    email: string
    name: string
    role: string
    phone?: string
    photo_url?: string
    location?: string
  }
}

// Enhanced TherapistProfile for admin dashboard with flattened user data
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

export interface User {
  id: string
  email: string
  name: string
  role: 'client' | 'therapist'
  condition?: string
  specialty?: string
  phone?: string
  photo_url?: string
  location?: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  client_id: string
  therapist_id: string
  appointment_date: string
  start_time: string
  end_time: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  session_type: 'video' | 'in_person'
  notes?: string
  created_at: string
  updated_at: string
  client: User
  therapist: User & { therapist_profile: TherapistProfile }
}

export interface AdminStats {
  totalUsers: number
  totalTherapists: number
  totalClients: number
  pendingApprovals: number
  totalAppointments: number
  completedSessions: number
  revenue: number
  activeUsers: number
}

export interface AdminActivity {
  id: string
  admin_id: string
  action: string
  target_type: 'user' | 'therapist' | 'appointment'
  target_id: string
  details: Record<string, any>
  created_at: string
}
