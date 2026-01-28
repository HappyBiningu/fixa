'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jobsApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function JobsPage() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    budgetMin: '',
    budgetMax: '',
    urgency: '',
    sortBy: 'distance',
  })

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    // Get user location (simplified - in production use geolocation API)
    const loadJobs = async () => {
      try {
        // Default to Pretoria coordinates
        const response = await jobsApi.getNearby({
          lat: -25.7479,
          lng: 28.2293,
          radius: 50,
        })
        setJobs(response.data)
        setFilteredJobs(response.data)
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [token, router])

  useEffect(() => {
    let filtered = [...jobs]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((item: any) => {
        const job = item.job
        return (
          job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((item: any) => 
        item.job.categoryId === filters.category || 
        item.category?.slug === filters.category
      )
    }

    // Budget filters
    if (filters.budgetMin) {
      filtered = filtered.filter((item: any) => {
        const amount = parseFloat(item.job.budgetAmount || '0')
        return amount >= parseFloat(filters.budgetMin)
      })
    }
    if (filters.budgetMax) {
      filtered = filtered.filter((item: any) => {
        const amount = parseFloat(item.job.budgetAmount || '0')
        return amount <= parseFloat(filters.budgetMax)
      })
    }

    // Urgency filter
    if (filters.urgency) {
      filtered = filtered.filter((item: any) => 
        item.job.urgency === filters.urgency
      )
    }

    // Sort
    filtered.sort((a: any, b: any) => {
      switch (filters.sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0)
        case 'budget':
          return parseFloat(b.job.budgetAmount || '0') - parseFloat(a.job.budgetAmount || '0')
        case 'newest':
          return new Date(b.job.createdAt).getTime() - new Date(a.job.createdAt).getTime()
        default:
          return 0
      }
    })

    setFilteredJobs(filtered)
  }, [jobs, searchTerm, filters])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-xl text-gray-600">Loading jobs...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Available Jobs</h1>
          {user?.role === 'client' || user?.role === 'both' ? (
            <Link
              href="/jobs/create"
              className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl hover-lift font-semibold"
            >
              Post a Job
            </Link>
          ) : null}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 card-hover animate-slide-up">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="cleaning">Cleaning</option>
              <option value="gardening">Gardening</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="painting">Painting</option>
              <option value="carpentry">Carpentry</option>
            </select>
            <input
              type="number"
              placeholder="Min Budget"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              value={filters.budgetMin}
              onChange={(e) => setFilters({ ...filters, budgetMin: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max Budget"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              value={filters.budgetMax}
              onChange={(e) => setFilters({ ...filters, budgetMax: e.target.value })}
            />
            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
              value={filters.urgency}
              onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
            >
              <option value="">All Urgency</option>
              <option value="TODAY">Today</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="FLEXIBLE">Flexible</option>
            </select>
            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="distance">Sort by Distance</option>
              <option value="budget">Sort by Budget</option>
              <option value="newest">Sort by Newest</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((item: any, idx) => {
            const job = item.job
            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 card-hover animate-slide-up group"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2 flex-1">
                    {job.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ml-2 ${
                    job.status === 'open' ? 'bg-green-100 text-green-800' :
                    job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status?.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{job.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold gradient-text">
                    R{job.budgetAmount || 'Negotiable'}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {item.distance?.toFixed(1)}km
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {job.bidsCount || 0} bids
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {job.viewsCount || 0} views
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-xl animate-slide-up">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-xl mb-4">
              {jobs.length === 0 ? 'No jobs found nearby' : 'No jobs match your filters'}
            </p>
            {(searchTerm || filters.category || filters.budgetMin || filters.budgetMax || filters.urgency) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilters({ category: '', budgetMin: '', budgetMax: '', urgency: '', sortBy: 'distance' })
                }}
                className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
