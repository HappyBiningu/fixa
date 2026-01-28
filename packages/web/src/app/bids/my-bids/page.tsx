'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { bidsApi } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function MyBidsPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [bids, setBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const loadBids = async () => {
      try {
        const res = await bidsApi.getMyBids()
        setBids(res.data || [])
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to load bids')
      } finally {
        setLoading(false)
      }
    }

    loadBids()
  }, [token, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-xl text-gray-600">Loading your bids...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 animate-fade-in">My Bids</h1>

        <div className="space-y-6">
          {bids.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center card-hover animate-slide-up">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-xl mb-4">You haven't placed any bids yet</p>
              <Link
                href="/jobs"
                className="inline-block text-teal-600 hover:text-teal-700 font-semibold transition-colors flex items-center gap-2 group"
              >
                Browse available jobs <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          ) : (
            bids.map((item: any, idx) => {
              const bid = item.bid || item
              const job = item.job || {}
              return (
                <div key={bid.id} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 card-hover animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <Link
                        href={`/jobs/${job.id || bid.jobId}`}
                        className="text-2xl font-bold text-gray-900 hover:text-teal-600 transition-colors block mb-2"
                      >
                        {job.title || 'Job'}
                      </Link>
                      <p className="text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                        {job.description || bid.message}
                      </p>
                      {bid.message && (
                        <p className="text-sm text-gray-500 italic">"{bid.message}"</p>
                      )}
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                      bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      bid.status === 'withdrawn' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bid.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-3xl font-bold gradient-text mb-1">
                        R{bid.proposedAmount}
                      </p>
                      <p className="text-sm text-gray-500">
                        {bid.creditsSpent || 0} credits spent
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-2">
                        Bid placed {new Date(bid.createdAt).toLocaleDateString()}
                      </p>
                      {bid.status === 'pending' && (
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to withdraw this bid? Credits are not refundable.')) {
                              try {
                                await bidsApi.withdraw(bid.id)
                                toast.success('Bid withdrawn')
                                setBids(bids.filter((b: any) => (b.bid || b).id !== bid.id))
                              } catch (error: any) {
                                toast.error(error.response?.data?.error || 'Failed to withdraw bid')
                              }
                            }
                          }}
                          className="text-red-600 hover:text-red-700 text-sm font-semibold transition-colors"
                        >
                          Withdraw Bid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
