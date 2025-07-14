'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import { User } from '@/types'
import DashboardLayout from '@/components/DashboardLayout'
import UserCard from '@/components/UserCard'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

function UsersPageContent() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'clients' | 'therapists'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const searchParams = useSearchParams()

  useEffect(() => {
    const filterParam = searchParams.get('filter')
    if (filterParam && ['clients', 'therapists'].includes(filterParam)) {
      setFilter(filterParam as any)
    }
    fetchUsers()
  }, [searchParams])

  useEffect(() => {
    filterUsers()
  }, [users, filter, searchTerm])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching users from Supabase...')
      
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Users fetched successfully:', data?.length || 0)
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load users'
      setError(errorMessage)
      toast.error(errorMessage)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    switch (filter) {
      case 'clients':
        filtered = filtered.filter(user => user.role === 'client')
        break
      case 'therapists':
        filtered = filtered.filter(user => user.role === 'therapist')
        break
    }

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }

  const filterCounts = {
    all: users.length,
    clients: users.filter(u => u.role === 'client').length,
    therapists: users.filter(u => u.role === 'therapist').length,
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage user accounts and their status</p>
          </div>
          
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading users: {error}</p>
            <button 
              onClick={fetchUsers}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage user accounts and their status</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex space-x-2 overflow-x-auto">
            {Object.entries(filterCounts).map(([filterKey, count]) => (
              <button
                key={filterKey}
                onClick={() => setFilter(filterKey as any)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    }>
      <UsersPageContent />
    </Suspense>
  )
}
