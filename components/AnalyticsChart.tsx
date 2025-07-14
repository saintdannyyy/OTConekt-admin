'use client'

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Mock data for analytics - in real app this would come from your database
const generateMockData = () => {
  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    last7Days.push({
      date: date.toISOString().split('T')[0],
      appointments: Math.floor(Math.random() * 20) + 5,
      newUsers: Math.floor(Math.random() * 10) + 2,
      revenue: Math.floor(Math.random() * 1000) + 200
    })
  }
  return last7Days
}

export default function AnalyticsChart() {
  const [chartData, setChartData] = useState<any[]>([])
  const [activeChart, setActiveChart] = useState<'appointments' | 'users' | 'revenue'>('appointments')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setChartData(generateMockData())
      setLoading(false)
    }, 1000)
  }, [])

  const chartConfig = {
    appointments: {
      title: 'Daily Appointments',
      dataKey: 'appointments',
      color: '#3B82F6',
      format: (value: number) => value.toString()
    },
    users: {
      title: 'New Users',
      dataKey: 'newUsers',
      color: '#10B981',
      format: (value: number) => value.toString()
    },
    revenue: {
      title: 'Daily Revenue',
      dataKey: 'revenue',
      color: '#8B5CF6',
      format: (value: number) => `$${value}`
    }
  }

  const currentConfig = chartConfig[activeChart]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
        <div className="flex space-x-2">
          {Object.entries(chartConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveChart(key as any)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                activeChart === key
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {config.title}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'revenue' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tickFormatter={currentConfig.format} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [currentConfig.format(value), currentConfig.title]}
                />
                <Bar dataKey={currentConfig.dataKey} fill={currentConfig.color} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tickFormatter={currentConfig.format} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [currentConfig.format(value), currentConfig.title]}
                />
                <Line 
                  type="monotone" 
                  dataKey={currentConfig.dataKey} 
                  stroke={currentConfig.color} 
                  strokeWidth={2}
                  dot={{ fill: currentConfig.color, strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
