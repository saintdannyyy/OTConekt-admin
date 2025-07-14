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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {user.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        <span className={`status-badge ${getUserTypeColor(user.role)}`}>
          {user.role}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <EnvelopeIcon className="h-4 w-4 mr-2" />
          <span>{user.email}</span>
        </div>
        
        {user.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <PhoneIcon className="h-4 w-4 mr-2" />
            <span>{user.phone}</span>
          </div>
        )}
        
        {user.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span>{user.location}</span>
          </div>
        )}

        {user.condition && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Condition:</span> {user.condition}
          </div>
        )}

        {user.specialty && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Specialty:</span> {user.specialty}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <EyeIcon className="h-4 w-4 mr-1" />
          View Profile
        </button>
      </div>

      {/* Timestamps */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <span className="font-medium">Joined:</span> {format(new Date(user.created_at), 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  )
}
