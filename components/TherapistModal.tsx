'use client'

import React from 'react'
import { AdminTherapistProfile } from '@/types'
import { format } from 'date-fns'
import { 
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckIcon,
  XMarkIcon as XIcon
} from '@heroicons/react/24/outline'

interface TherapistModalProps {
  therapist: AdminTherapistProfile
  isOpen: boolean
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

const TherapistModal = ({
  therapist,
  isOpen,
  onClose,
  onApprove,
  onReject
}: TherapistModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {therapist.users?.photo_url ? (
              <img
                src={therapist.users.photo_url}
                alt={therapist.users.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-xl">
                  {therapist.users?.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">{therapist.users?.name || 'Unknown'}</h2>
              <p className="text-gray-600">{therapist.users?.email || 'No email'}</p>
              <span className={`status-badge ${therapist.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} mt-1`}>
                {therapist.is_approved ? 'Approved' : 'Pending'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <span className="text-gray-700">{therapist.users?.email || 'Not provided'}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <span className="text-gray-700">{therapist.users?.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Credentials</p>
                <p className="text-gray-700">{therapist.credentials || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="text-gray-700">{therapist.experience_years || 0} years</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {therapist.bio && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Biography</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{therapist.bio}</p>
            </div>
          )}

          {/* Specialties */}
          {therapist.specialties && therapist.specialties.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {therapist.specialties.map((spec: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Application Date */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Date</h3>
            <p className="text-gray-700">
              {format(new Date(therapist.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
            </p>
          </div>
        </div>

        {/* Actions */}
        {!therapist.is_approved && (
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => onReject(therapist.id)}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
            >
              <XIcon className="h-4 w-4" />
              <span>Reject</span>
            </button>
            <button
              onClick={() => onApprove(therapist.id)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <CheckIcon className="h-4 w-4" />
              <span>Approve</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TherapistModal
