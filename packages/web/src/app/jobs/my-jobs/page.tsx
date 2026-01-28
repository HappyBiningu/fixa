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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-xl text-gray-600">Loading your jobs...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">My Jobs</h1>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/jobs/my-jobs"
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                statusFilter === 'all'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            <Link
              href="/jobs/my-jobs?status=open"
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                statusFilter === 'open'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Open
            </Link>
            <Link
              href="/jobs/my-jobs?status=in_progress"
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                statusFilter === 'in_progress'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Progress
            </Link>
            <Link
              href="/jobs/my-jobs?status=completed"
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                statusFilter === 'completed'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((item: any, idx) => {
            const job = item.job || item
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
                    job.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
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
          <div className="text-center py-16 bg-white rounded-2xl shadow-xl animate-slide-up">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-xl mb-4">No jobs found</p>
            <Link
              href="/jobs/create"
              className="inline-block text-teal-600 hover:text-teal-700 font-semibold transition-colors flex items-center gap-2 group"
            >
              Post your first job <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
