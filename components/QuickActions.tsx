'use client'

import React from 'react'
import Link from 'next/link'
import { 
  UserGroupIcon, 
  UsersIcon, 
  CalendarIcon, 
  ChartBarIcon,
  ClockIcon,
  CogIcon
} from '@heroicons/react/24/outline'

const quickActions = [
  {
    name: 'Review Therapists',
    description: 'Approve or reject therapist applications',
    href: '/therapists?filter=pending',
    icon: UserGroupIcon,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    name: 'Manage Users',
    description: 'View and manage user accounts',
    href: '/users',
    icon: UsersIcon,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  {
    name: 'View Appointments',
    description: 'Monitor scheduled appointments',
    href: '/appointments',
    icon: CalendarIcon,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600'
  },
  {
    name: 'Analytics',
    description: 'View platform analytics and reports',
    href: '/analytics',
    icon: ChartBarIcon,
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600'
  },
  {
    name: 'Platform Settings',
    description: 'Configure platform settings',
    href: '/settings',
    icon: CogIcon,
    color: 'bg-gray-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600'
  },
  {
    name: 'Recent Activity',
    description: 'View recent platform activity',
    href: '/activity',
    icon: ClockIcon,
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600'
  }
]

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          
          return (
            <Link
              key={action.name}
              href={action.href}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className={`${action.bgColor} rounded-lg p-2`}>
                <Icon className={`h-5 w-5 ${action.textColor}`} />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">{action.name}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
