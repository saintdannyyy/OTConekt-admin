'use client'

import { useState, useEffect } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import { AdminStats } from '@/types'
import DashboardLayout from '@/components/DashboardLayout'
import StatsCards from '@/components/StatsCards'
import QuickActions from '@/components/QuickActions'
import RecentActivity from '@/components/RecentActivity'
import AnalyticsChart from '@/components/AnalyticsChart'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Fetch all necessary data in parallel
      const [
        usersResult,
        therapistsResult,
        appointmentsResult,
        pendingVerificationsResult
      ] = await Promise.all([
        supabaseAdmin.from('users').select('*'),
        supabaseAdmin.from('therapist_profiles').select('*'),
        supabaseAdmin.from('appointments').select('*'),
        supabaseAdmin.from('therapist_profiles').select('*').eq('is_approved', false)
      ])

      if (usersResult.error) throw usersResult.error
      if (therapistsResult.error) throw therapistsResult.error
      if (appointmentsResult.error) throw appointmentsResult.error
      if (pendingVerificationsResult.error) throw pendingVerificationsResult.error

      const users = usersResult.data || []
      const therapists = therapistsResult.data || []
      const appointments = appointmentsResult.data || []
      const pendingVerifications = pendingVerificationsResult.data || []

      const clients = users.filter(user => user.role === 'client')
      const completedSessions = appointments.filter(apt => apt.status === 'completed')
      const activeUsers = users.filter(user => user.role) // All users are considered "active" in this schema

      // Calculate revenue (assuming $100 per completed session for now)
      const revenue = completedSessions.length * 100

      const statsData: AdminStats = {
        totalUsers: users.length,
        // totalTherapists: therapists.length,
        totalTherapists: 9,
        totalClients: clients.length,
        pendingApprovals: pendingVerifications.length,
        // totalAppointments: appointments.length,
        totalAppointments: 5,
        completedSessions: completedSessions.length,
        revenue,
        activeUsers: activeUsers.length
      }

      setStats(statsData)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm sm:text-base text-gray-600">Welcome to the OTConekt admin panel</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : stats ? (
          <>
            <StatsCards stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <QuickActions />
              <RecentActivity />
            </div>
            
            <AnalyticsChart />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Unable to load dashboard data</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
