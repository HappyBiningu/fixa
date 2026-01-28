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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading jobs...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
          {user?.role === 'client' || user?.role === 'both' ? (
            <Link
              href="/jobs/create"
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
            >
              Post a Job
            </Link>
          ) : null}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              value={filters.budgetMin}
              onChange={(e) => setFilters({ ...filters, budgetMin: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max Budget"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              value={filters.budgetMax}
              onChange={(e) => setFilters({ ...filters, budgetMax: e.target.value })}
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
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
          {filteredJobs.map((item: any) => {
            const job = item.job
            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-teal-600 font-semibold">
                    R{job.budgetAmount || 'Negotiable'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.distance?.toFixed(1)}km away
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {job.bidsCount || 0} bids • {job.viewsCount || 0} views
                </div>
              </Link>
            )
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">
              {jobs.length === 0 ? 'No jobs found nearby' : 'No jobs match your filters'}
            </p>
            {(searchTerm || filters.category || filters.budgetMin || filters.budgetMax || filters.urgency) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilters({ category: '', budgetMin: '', budgetMax: '', urgency: '', sortBy: 'distance' })
                }}
                className="mt-4 text-teal-600 hover:text-teal-700"
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

