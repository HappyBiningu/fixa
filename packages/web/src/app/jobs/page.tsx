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
  const [loading, setLoading] = useState(true)

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
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [token, router])

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((item: any) => {
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

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No jobs found nearby</p>
          </div>
        )}
      </div>
    </div>
  )
}

