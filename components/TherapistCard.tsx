'use client'

import React, { useState } from 'react'
import { AdminTherapistProfile } from '@/types'
import { format } from 'date-fns'
import { 
  CheckIcon, 
  XMarkIcon, 
  EyeIcon,
  MapPinIcon,
  AcademicCapIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface TherapistCardProps {
  therapist: AdminTherapistProfile
  onView: () => void
  onApprove: () => void
  onReject: () => void
}

export default function TherapistCard({ therapist, onView, onApprove, onReject }: TherapistCardProps) {
  const getStatusColor = (isApproved: boolean) => {
    return isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {therapist.users?.photo_url ? (
              <img
                src={therapist.users.photo_url}
                alt={therapist.users?.name || 'Therapist'}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium">
                  {therapist.users?.name?.charAt(0) || 'T'}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{therapist.users?.name || 'Unknown'}</h3>
              <p className="text-sm text-gray-600">{therapist.users?.email || 'No email'}</p>
            </div>
          </div>
          <span className={`status-badge ${getStatusColor(therapist.is_approved)}`}>
            {therapist.is_approved ? 'approved' : 'pending'}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <AcademicCapIcon className="h-4 w-4 mr-2" />
            <span>{therapist.credentials || 'No credentials listed'}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span>{therapist.experience_years} years experience</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
            <span>${therapist.hourly_rate || 0}/hour</span>
          </div>
        </div>

        {/* Specializations */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Specialties</p>
          <div className="flex flex-wrap gap-2">
            {therapist.specialties.slice(0, 3).map((spec, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {spec}
              </span>
            ))}
            {therapist.specialties.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{therapist.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            View Details
          </button>
          
          {!therapist.is_approved && (
            <>
              <button
                onClick={onApprove}
                className="flex items-center justify-center px-3 py-2 bg-green-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
              
              <button
                onClick={onReject}
                className="flex items-center justify-center px-3 py-2 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Created Date */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Applied {format(new Date(therapist.created_at), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
    </div>
  )
}
}
