'use client'

import React, { useState, useEffect } from 'react'
import { AdminTherapistProfile } from '@/types'
import { TherapistService } from '@/lib/therapist-service'
import DashboardLayout from '@/components/DashboardLayout'
import TherapistCard from '@/components/TherapistCard'
import TherapistModal from '@/components/TherapistModal'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<AdminTherapistProfile[]>([])
  const [filteredTherapists, setFilteredTherapists] = useState<AdminTherapistProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTherapist, setSelectedTherapist] = useState<AdminTherapistProfile | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const searchParams = useSearchParams()

  useEffect(() => {
    const filterParam = searchParams.get('filter')
    if (filterParam && ['pending', 'approved'].includes(filterParam)) {
      setFilter(filterParam as any)
    }
    fetchTherapists()
  }, [searchParams])

  useEffect(() => {
    filterTherapists()
  }, [therapists, filter, searchTerm])

  const fetchTherapists = async () => {
    try {
      setLoading(true)
      console.log('🔄 Starting therapist data fetch at:', new Date().toISOString())

      // STEP 1: Fetch all therapist profiles with user data using SQL JOIN
      console.log('📋 Fetching therapist profiles with user data via getadmin_all_therapists...')
      const data = await TherapistService.getAllTherapists()

      console.log(`✅ Found ${data?.length || 0} therapist profiles`)

      // Debugging check: Log the raw response
      if (data && data.length > 0) {
        console.log('📊 Sample therapist profile response:', JSON.stringify(data[0], null, 2))
        console.log('🔍 User IDs found:', data.map(p => p.user_id))
        console.log('🔑 Available fields in response:', Object.keys(data[0]))
      } else {
        console.warn('⚠️ No therapist profiles found in database')
        toast.error('No therapists found in the database')
        setTherapists([])
        return
      }

      // Additional debugging: Check for data integrity
      const profilesWithMissingData = data.filter(t => 
        !t.name || t.name === 'Licensed Therapist'
      )

      if (profilesWithMissingData.length > 0) {
        console.warn(`⚠️ ${profilesWithMissingData.length} profiles have missing user data`)
      }

      setTherapists(data)
      console.log(`✅ Successfully loaded ${data.length} therapists`)
      
    } catch (error) {
      console.error('💥 Critical error loading therapists:', JSON.stringify(error, null, 2))

      // Enhanced error debugging
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }

      toast.error('Failed to load therapists. Please check your connection and try again.')
      setTherapists([])
    } finally {
      setLoading(false)
      console.log('🏁 Therapist data fetch completed')
    }
  }

  const filterTherapists = () => {
    let filtered = therapists

    if (filter === 'pending') {
      filtered = filtered.filter(therapist => !therapist.is_approved)
    } else if (filter === 'approved') {
      filtered = filtered.filter(therapist => therapist.is_approved)
    }

    if (searchTerm) {
      filtered = filtered.filter(therapist =>
        therapist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.specialties.some((spec: string) => 
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    setFilteredTherapists(filtered)
  }

  const handleApprove = async (therapistId: string) => {
    try {
      console.log(`✅ Approving therapist: ${therapistId}`)
      await TherapistService.approveTherapist(therapistId)
      
      toast.success('Therapist approved successfully')
      await fetchTherapists()
      setSelectedTherapist(null)
    } catch (error) {
      console.error('💥 Error approving therapist:', error)
      toast.error('Failed to approve therapist')
    }
  }

  const handleReject = async (therapistId: string) => {
    try {
      console.log(`❌ Rejecting therapist: ${therapistId}`)
      await TherapistService.rejectTherapist(therapistId)
      
      toast.success('Therapist rejected')
      await fetchTherapists()
      setSelectedTherapist(null)
    } catch (error) {
      console.error('💥 Error rejecting therapist:', error)
      toast.error('Failed to reject therapist')
    }
  }

  const filterCounts = {
    all: therapists.length,
    pending: therapists.filter(t => !t.is_approved).length,
    approved: therapists.filter(t => t.is_approved).length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Therapist Management</h1>
            <p className="text-gray-600">Review and manage therapist profiles and verifications</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex space-x-2">
            {Object.entries(filterCounts).map(([filterKey, count]) => (
              <button
                key={filterKey}
                onClick={() => setFilter(filterKey as any)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filter === filterKey
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)} ({count})
              </button>
            ))}
          </div>
          
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search therapists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Therapists Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredTherapists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No therapists found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTherapists.map((therapist) => (
              <TherapistCard
                key={therapist.id}
                therapist={therapist}
                onView={() => setSelectedTherapist(therapist)}
                onApprove={() => handleApprove(therapist.id)}
                onReject={() => handleReject(therapist.id)}
              />
            ))}
          </div>
        )}

        {/* Therapist Detail Modal */}
        {selectedTherapist && (
          <TherapistModal
            therapist={selectedTherapist}
            isOpen={true}
            onClose={() => setSelectedTherapist(null)}
            onApprove={() => handleApprove(selectedTherapist.id)}
            onReject={() => handleReject(selectedTherapist.id)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
