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
      // Reload job and bids
      const jobRes = await jobsApi.getById(params.id as string)
      setJob(jobRes.data)
      const jobData = jobRes.data?.job || jobRes.data
      if (jobData?.clientId === user?.id) {
        const bidsRes = await bidsApi.getJobBids(params.id as string)
        setBids(bidsRes.data || [])
      }
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
      // Reload job
      const jobRes = await jobsApi.getById(params.id as string)
      setJob(jobRes.data)
      const bidsRes = await bidsApi.getJobBids(params.id as string)
      setBids(bidsRes.data || [])
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to accept bid')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-xl text-gray-600">Loading job details...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/jobs" className="text-teal-600 hover:text-teal-700 mb-6 inline-flex items-center gap-2 group transition-colors animate-fade-in">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 card-hover animate-slide-up">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{jobData.title}</h1>
                  <p className="text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Posted {new Date(jobData.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  jobData.status === 'open' ? 'bg-green-100 text-green-800' :
                  jobData.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {jobData.status?.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{jobData.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8 p-6 bg-gradient-to-br from-teal-50 to-white rounded-xl border border-teal-100">
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">Budget</p>
                  <p className="text-3xl font-bold gradient-text">
                    {jobData.budgetType === 'fixed' && `R${jobData.budgetAmount}`}
                    {jobData.budgetType === 'hourly' && `R${jobData.budgetAmount}/hour`}
                    {jobData.budgetType === 'negotiable' && 
                      `R${jobData.budgetMin || 0} - R${jobData.budgetMax || 0}`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">Urgency</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {jobData.urgency?.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </p>
                  <p className="text-lg text-gray-900">{jobData.locationAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">Engagement</p>
                  <p className="text-lg text-gray-900 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {jobData.viewsCount || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {jobData.bidsCount || 0} bids
                    </span>
                  </p>
                </div>
              </div>

              {isWorker && jobData.status === 'open' && !showBidForm && !isOwner && (
                <button
                  onClick={() => setShowBidForm(true)}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover-lift"
                >
                  Place a Bid ({creditCost} credits)
                </button>
              )}

              {showBidForm && (
                <form onSubmit={handlePlaceBid} className="mt-6 p-6 bg-gradient-to-br from-teal-50 to-white rounded-xl border border-teal-100 space-y-5 animate-slide-up">
                  <h3 className="text-xl font-bold text-gray-900">Place Your Bid</h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Proposal *
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none"
                      placeholder="Describe how you'll complete this job..."
                      value={bidData.message}
                      onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Proposed Amount (ZAR) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      value={bidData.proposedAmount}
                      onChange={(e) => setBidData({ ...bidData, proposedAmount: e.target.value })}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Estimated Duration
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        placeholder="e.g., 2 hours"
                        value={bidData.estimatedDuration}
                        onChange={(e) => setBidData({ ...bidData, estimatedDuration: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Availability
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        placeholder="e.g., Available today"
                        value={bidData.availability}
                        onChange={(e) => setBidData({ ...bidData, availability: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={bidLoading}
                      className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover-lift disabled:opacity-50"
                    >
                      {bidLoading ? 'Placing Bid...' : `Place Bid (${creditCost} credits)`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBidForm(false)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Bids Section (for clients) */}
            {isOwner && bids.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 card-hover animate-slide-up">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Bids Received ({bids.length})
                </h2>
                <div className="space-y-6">
                  {bids.map((item: any, idx) => {
                    const bid = item.bid || item
                    const worker = item.worker || {}
                    return (
                      <div key={bid.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-teal-300 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                          <div className="flex-1">
                            <Link href={`/profile/${worker.id}`} className="text-xl font-bold text-gray-900 hover:text-teal-600 transition-colors block mb-2">
                              {worker.fullName || 'Worker'}
                            </Link>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {bid.workerRatingAtTime || worker.averageRating || 'N/A'} • 
                              {bid.workerJobsCompletedAtTime || worker.jobsCompleted || 0} jobs completed
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold gradient-text">
                              R{bid.proposedAmount}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4 leading-relaxed">{bid.message}</p>
                        {bid.estimatedDuration && (
                          <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Estimated: {bid.estimatedDuration}
                          </p>
                        )}
                        {bid.availability && (
                          <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {bid.availability}
                          </p>
                        )}
                        {bid.status === 'pending' && (
                          <button
                            onClick={() => handleAcceptBid(bid.id)}
                            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover-lift"
                          >
                            Accept Bid
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 card-hover animate-slide-in-right">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Job Information</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1 font-medium">Category</p>
                  <p className="font-semibold text-gray-900">{jobData.category?.name || job.category?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1 font-medium">Budget Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{jobData.budgetType}</p>
                </div>
                {jobData.preferredDate && (
                  <div>
                    <p className="text-gray-600 mb-1 font-medium">Preferred Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(jobData.preferredDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {jobData.preferredTime && (
                  <div>
                    <p className="text-gray-600 mb-1 font-medium">Preferred Time</p>
                    <p className="font-semibold text-gray-900">{jobData.preferredTime}</p>
                  </div>
                )}
                {jobData.expiresAt && (
                  <div>
                    <p className="text-gray-600 mb-1 font-medium">Expires</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(jobData.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {isOwner && jobData.status === 'in_progress' && (
              <div className="bg-white rounded-2xl shadow-xl p-6 space-y-3 card-hover animate-slide-in-right">
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
              <div className="bg-white rounded-2xl shadow-xl p-6 card-hover animate-slide-in-right">
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
