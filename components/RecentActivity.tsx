'use client'

import React, { useState, useEffect } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import { AdminActivity } from '@/types'
import { format } from 'date-fns'
import { 
  UserIcon, 
  UserGroupIcon, 
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function RecentActivity() {
  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      setLoading(true)
      
      // For now, we'll create mock activity data since the admin_activity table might not exist yet
      const mockActivities: AdminActivity[] = [
        {
          id: '1',
          admin_id: 'admin-1',
          action: 'Approved therapist verification',
          target_type: 'therapist',
          target_id: 'therapist-1',
          details: { therapist_name: 'Dr. Sarah Johnson' },
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
        },
        {
          id: '2',
          admin_id: 'admin-1',
          action: 'Suspended user account',
          target_type: 'user',
          target_id: 'user-1',
          details: { user_name: 'John Smith', reason: 'Violation of terms' },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
        },
        {
          id: '3',
          admin_id: 'admin-1',
          action: 'Cancelled appointment',
          target_type: 'appointment',
          target_id: 'appointment-1',
          details: { client_name: 'Jane Doe', therapist_name: 'Dr. Mike Wilson' },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // 4 hours ago
        },
        {
          id: '4',
          admin_id: 'admin-1',
          action: 'Rejected therapist verification',
          target_type: 'therapist',
          target_id: 'therapist-2',
          details: { therapist_name: 'Dr. Alex Brown', reason: 'Incomplete documentation' },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() // 6 hours ago
        },
        {
          id: '5',
          admin_id: 'admin-1',
          action: 'Activated user account',
          target_type: 'user',
          target_id: 'user-2',
          details: { user_name: 'Emily Davis' },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() // 8 hours ago
        }
      ]

      setActivities(mockActivities)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (targetType: string) => {
    switch (targetType) {
      case 'therapist':
        return UserGroupIcon
      case 'user':
        return UserIcon
      case 'appointment':
        return CalendarIcon
      default:
        return ClockIcon
    }
  }

  const getActivityColor = (action: string) => {
    if (action.includes('Approved') || action.includes('Activated')) {
      return 'text-green-600 bg-green-50'
    }
    if (action.includes('Rejected') || action.includes('Suspended') || action.includes('Cancelled')) {
      return 'text-red-600 bg-red-50'
    }
    return 'text-blue-600 bg-blue-50'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
          View All
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.target_type)
            const colorClasses = getActivityColor(activity.action)
            
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`rounded-lg p-2 ${colorClasses}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  {activity.details && (
                    <p className="text-sm text-gray-500">
                      {activity.details.therapist_name || activity.details.user_name || activity.details.client_name}
                      {activity.details.reason && ` - ${activity.details.reason}`}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
