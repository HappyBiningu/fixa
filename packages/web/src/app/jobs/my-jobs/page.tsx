'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { jobsApi } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function MyJobsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, token } = useAuthStore()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const statusFilter = searchParams.get('status') || 'all'

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const loadJobs = async () => {
      try {
        const response = await jobsApi.getMyJobs()
        setJobs(response.data || [])
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [token, router])

  const filteredJobs = statusFilter === 'all'
    ? jobs
    : jobs.filter((item: any) => {
        const job = item.job || item
        return job.status === statusFilter
      })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your jobs...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Jobs</h1>
          <div className="flex gap-3">
            <Link
              href="/jobs/my-jobs"
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                statusFilter === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </Link>
            <Link
              href="/jobs/my-jobs?status=open"
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                statusFilter === 'open'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Open
            </Link>
            <Link
              href="/jobs/my-jobs?status=in_progress"
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                statusFilter === 'in_progress'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              In Progress
            </Link>
            <Link
              href="/jobs/my-jobs?status=completed"
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                statusFilter === 'completed'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completed
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((item: any) => {
            const job = item.job || item
            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    job.status === 'open' ? 'bg-green-100 text-green-800' :
                    job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    job.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {job.status?.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-teal-600 font-semibold">
                    R{job.budgetAmount || 'Negotiable'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {job.bidsCount || 0} bids
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </Link>
            )
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No jobs found</p>
            <Link
              href="/jobs/create"
              className="text-teal-600 hover:text-teal-700 mt-4 inline-block"
            >
              Post your first job →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

