'use client'

import React from 'react'
import { AdminStats } from '@/types'
import { 
  UsersIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  CheckBadgeIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface StatsCardsProps {
  stats: AdminStats
}

const statCards = [
  {
    name: 'Total Users',
    key: 'totalUsers' as keyof AdminStats,
    icon: UsersIcon,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    name: 'Therapists',
    key: 'totalTherapists' as keyof AdminStats,
    icon: UserGroupIcon,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  {
    name: 'Clients',
    key: 'totalClients' as keyof AdminStats,
    icon: UserIcon,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600'
  },
  {
    name: 'Pending Approvals',
    key: 'pendingApprovals' as keyof AdminStats,
    icon: ClockIcon,
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600'
  },
  {
    name: 'Total Appointments',
    key: 'totalAppointments' as keyof AdminStats,
    icon: CalendarIcon,
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600'
  },
  {
    name: 'Completed Sessions',
    key: 'completedSessions' as keyof AdminStats,
    icon: CheckBadgeIcon,
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600'
  },
  {
    name: 'Revenue',
    key: 'revenue' as keyof AdminStats,
    icon: CurrencyDollarIcon,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    format: 'currency'
  },
  {
    name: 'Active Users',
    key: 'activeUsers' as keyof AdminStats,
    icon: ArrowTrendingUpIcon,
    color: 'bg-cyan-500',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600'
  }
]

export default function StatsCards({ stats }: StatsCardsProps) {
  const formatValue = (value: number, format?: string) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    }
    return value.toLocaleString()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card) => {
        const Icon = card.icon
        const value = stats[card.key] as number
        
        return (
          <div key={card.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${card.bgColor} rounded-lg p-3`}>
                <Icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatValue(value, card.format)}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
