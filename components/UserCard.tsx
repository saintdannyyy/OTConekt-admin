'use client'

import React from 'react'
import { User } from '@/types'
import { format } from 'date-fns'
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface UserCardProps {
  user: User
}

export default function UserCard({ user }: UserCardProps) {
  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'client':
        return 'bg-blue-100 text-blue-800'
      case 'therapist':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {user.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getUserTypeColor(user.role)}`}>
          {user.role}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <EnvelopeIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        
        {user.phone && (
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <PhoneIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
            <span>{user.phone}</span>
          </div>
        )}
        
        {user.location && (
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{user.location}</span>
          </div>
        )}

        {user.condition && (
          <div className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Condition:</span> <span className="truncate">{user.condition}</span>
          </div>
        )}

        {user.specialty && (
          <div className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Specialty:</span> <span className="truncate">{user.specialty}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 flex items-center justify-center px-2 py-2 sm:px-3 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          <span className="hidden sm:inline">View Profile</span>
          <span className="sm:hidden">View</span>
        </button>
      </div>

      {/* Timestamps */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <span className="font-medium">Joined:</span> {format(new Date(user.created_at), 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  )
}
