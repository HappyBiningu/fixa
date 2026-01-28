'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { jobsApi, bidsApi, creditsApi } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [job, setJob] = useState<any>(null)
  const [bids, setBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [bidLoading, setBidLoading] = useState(false)
  const [showBidForm, setShowBidForm] = useState(false)
  const [bidData, setBidData] = useState({
    message: '',
    proposedAmount: '',
    estimatedDuration: '',
    availability: '',
  })
  const [creditCost, setCreditCost] = useState(0)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const loadJob = async () => {
      try {
        const jobRes = await jobsApi.getById(params.id as string)
        setJob(jobRes.data)
        
        const jobData = jobRes.data?.job || jobRes.data
        
        // Load bids if user is the client
        if (jobData?.clientId === user?.id) {
          try {
            const bidsRes = await bidsApi.getJobBids(params.id as string)
            setBids(bidsRes.data || [])
          } catch (error) {
            // Ignore if not authorized
          }
        }
        
        // Load credit cost if user is a worker
        if ((user?.role === 'worker' || user?.role === 'both') && jobData?.status === 'open') {
          try {
            const costRes = await creditsApi.calculateBidCost(params.id as string)
            setCreditCost(costRes.data?.cost || 2)
          } catch (error) {
            setCreditCost(2)
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to load job')
        router.push('/jobs')
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [params.id, token, router, user])

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bidData.message || !bidData.proposedAmount) {
      toast.error('Please fill in all required fields')
      return
    }

    setBidLoading(true)
    try {
      await bidsApi.create(params.id as string, {
        ...bidData,
        proposedAmount: parseFloat(bidData.proposedAmount),
      })
      toast.success('Bid placed successfully!')
      setShowBidForm(false)
      setBidData({ message: '', proposedAmount: '', estimatedDuration: '', availability: '' })
      // Reload bids
      const bidsRes = await bidsApi.getJobBids(params.id as string)
      setBids(bidsRes.data || [])
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to place bid')
    } finally {
      setBidLoading(false)
    }
  }

  const handleAcceptBid = async (bidId: string) => {
    if (!confirm('Are you sure you want to accept this bid?')) return

    try {
      await bidsApi.accept(bidId)
      toast.success('Bid accepted! The worker has been notified.')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to accept bid')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading job details...</div>
      </div>
    )
  }

  if (!job) {
    return null
  }

  const jobData = job.job || job
  const isClient = user?.role === 'client' || user?.role === 'both'
  const isWorker = user?.role === 'worker' || user?.role === 'both'
  const isOwner = jobData.clientId === user?.id || jobData.client?.id === user?.id

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/jobs" className="text-teal-600 hover:text-teal-700 mb-4 inline-block">
          ← Back to Jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{jobData.title}</h1>
                  <p className="text-gray-500">
                    Posted {new Date(jobData.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  jobData.status === 'open' ? 'bg-green-100 text-green-800' :
                  jobData.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {jobData.status?.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{jobData.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Budget</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {jobData.budgetType === 'fixed' && `R${jobData.budgetAmount}`}
                    {jobData.budgetType === 'hourly' && `R${jobData.budgetAmount}/hour`}
                    {jobData.budgetType === 'negotiable' && 
                      `R${jobData.budgetMin || 0} - R${jobData.budgetMax || 0}`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Urgency</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {jobData.urgency?.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-lg text-gray-900">{jobData.locationAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Views & Bids</p>
                  <p className="text-lg text-gray-900">
                    {jobData.viewsCount || 0} views • {jobData.bidsCount || 0} bids
                  </p>
                </div>
              </div>

              {isWorker && jobData.status === 'open' && !showBidForm && (
                <button
                  onClick={() => setShowBidForm(true)}
                  className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
                >
                  Place a Bid ({creditCost} credits)
                </button>
              )}

              {showBidForm && (
                <form onSubmit={handlePlaceBid} className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold">Place Your Bid</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Proposal *
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="Describe how you'll complete this job..."
                      value={bidData.message}
                      onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proposed Amount (ZAR) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      value={bidData.proposedAmount}
                      onChange={(e) => setBidData({ ...bidData, proposedAmount: e.target.value })}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Duration
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., 2 hours"
                        value={bidData.estimatedDuration}
                        onChange={(e) => setBidData({ ...bidData, estimatedDuration: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., Available today"
                        value={bidData.availability}
                        onChange={(e) => setBidData({ ...bidData, availability: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={bidLoading}
                      className="flex-1 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
                    >
                      {bidLoading ? 'Placing Bid...' : `Place Bid (${creditCost} credits)`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBidForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Bids Section (for clients) */}
            {isOwner && bids.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Bids ({bids.length})
                </h2>
                <div className="space-y-4">
                  {bids.map((item: any) => {
                    const bid = item.bid || item
                    const worker = item.worker || {}
                    return (
                      <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {worker.fullName || 'Worker'}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {bid.workerRatingAtTime || worker.averageRating || 'N/A'} • 
                              {bid.workerJobsCompletedAtTime || worker.jobsCompleted || 0} jobs completed
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-teal-600">
                              R{bid.proposedAmount}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{bid.message}</p>
                        {bid.estimatedDuration && (
                          <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Estimated: {bid.estimatedDuration}
                          </p>
                        )}
                        {bid.availability && (
                          <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {bid.availability}
                          </p>
                        )}
                        <button
                          onClick={() => handleAcceptBid(bid.id)}
                          className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                        >
                          Accept Bid
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Job Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">{jobData.category?.name || job.category?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Budget Type</p>
                  <p className="font-medium capitalize">{jobData.budgetType}</p>
                </div>
                {jobData.preferredDate && (
                  <div>
                    <p className="text-gray-500">Preferred Date</p>
                    <p className="font-medium">
                      {new Date(jobData.preferredDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {jobData.expiresAt && (
                  <div>
                    <p className="text-gray-500">Expires</p>
                    <p className="font-medium">
                      {new Date(jobData.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {isOwner && jobData.status === 'in_progress' && (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
                <Link
                  href={`/chat/${jobData.id}`}
                  className="block w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl hover-lift flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat with Worker
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await jobsApi.complete(jobData.id)
                      toast.success('Job marked as complete!')
                      router.push(`/jobs/${jobData.id}/rate`)
                    } catch (error: any) {
                      toast.error(error.response?.data?.error || 'Failed to complete job')
                    }
                  }}
                  className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl hover-lift flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark as Complete
                </button>
              </div>
            )}

            {jobData.status === 'pending_completion' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <Link
                  href={`/jobs/${jobData.id}/rate`}
                  className="block w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl hover-lift flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Rate & Complete Job
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
