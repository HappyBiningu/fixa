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
        // In production, use a dedicated endpoint
        const res = await api.get('/bids/my-bids')
        setBids(res.data || [])
      } catch (error: any) {
        toast.error('Failed to load bids')
      } finally {
        setLoading(false)
      }
    }

    loadBids()
  }, [token, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your bids...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Bids</h1>

        <div className="space-y-4">
          {bids.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-xl mb-4">You haven't placed any bids yet</p>
              <Link
                href="/jobs"
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                Browse available jobs →
              </Link>
            </div>
          ) : (
            bids.map((item: any) => {
              const bid = item.bid || item
              const job = item.job || {}
              return (
                <div key={bid.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <Link
                        href={`/jobs/${job.id || bid.jobId}`}
                        className="text-xl font-semibold text-gray-900 hover:text-teal-600"
                      >
                        {job.title || 'Job'}
                      </Link>
                      <p className="text-gray-600 mt-1 line-clamp-2">
                        {job.description || bid.message}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      bid.status === 'withdrawn' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bid.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-teal-600">
                        R{bid.proposedAmount}
                      </p>
                      <p className="text-sm text-gray-500">
                        {bid.creditsSpent} credits spent
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
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
                          className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
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

