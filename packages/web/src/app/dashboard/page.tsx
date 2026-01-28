'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { jobsApi, creditsApi, walletApi } from '@/lib/api'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const loadDashboard = async () => {
      try {
        const [jobsRes, creditsRes, walletRes] = await Promise.all([
          jobsApi.getMyJobs().catch(() => ({ data: [] })),
          creditsApi.getBalance().catch(() => ({ data: { balance: 0 } })),
          walletApi.getWallet().catch(() => ({ data: { balanceAvailable: '0' } })),
        ])

        const myJobs = jobsRes.data || []
        const activeJobs = myJobs.filter((j: any) => 
          j.job?.status === 'open' || j.job?.status === 'in_progress'
        ).length
        const completedJobs = myJobs.filter((j: any) => 
          j.job?.status === 'completed'
        ).length

        setStats({
          activeJobs,
          completedJobs,
          totalJobs: myJobs.length,
          credits: creditsRes.data?.balance || 0,
          wallet: walletRes.data?.balanceAvailable || '0',
        })
      } catch (error: any) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [token, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    )
  }

  const isWorker = user?.role === 'worker' || user?.role === 'both'
  const isClient = user?.role === 'client' || user?.role === 'both'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullName || 'User'}!
          </h1>
          <p className="text-gray-600">Here's an overview of your activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isClient && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Active Jobs</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeJobs || 0}</p>
                  </div>
                  <div className="text-4xl">📋</div>
                </div>
                <Link href="/jobs/my-jobs" className="text-teal-600 text-sm mt-4 inline-block hover:underline">
                  View all →
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Completed Jobs</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.completedJobs || 0}</p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
                <Link href="/jobs/my-jobs?status=completed" className="text-teal-600 text-sm mt-4 inline-block hover:underline">
                  View all →
                </Link>
              </div>
            </>
          )}

          {isWorker && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Credits</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.credits || 0}</p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
                <Link href="/credits" className="text-teal-600 text-sm mt-4 inline-block hover:underline">
                  Buy more →
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Wallet Balance</p>
                    <p className="text-3xl font-bold text-gray-900">
                      R{parseFloat(stats.wallet || '0').toLocaleString()}
                    </p>
                  </div>
                  <div className="text-4xl">💳</div>
                </div>
                <Link href="/wallet" className="text-teal-600 text-sm mt-4 inline-block hover:underline">
                  View wallet →
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {isClient && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/jobs/create"
                  className="block w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition text-center font-semibold"
                >
                  Post a New Job
                </Link>
                <Link
                  href="/jobs/my-jobs"
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition text-center font-semibold"
                >
                  View My Jobs
                </Link>
              </div>
            </div>
          )}

          {isWorker && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/jobs"
                  className="block w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition text-center font-semibold"
                >
                  Browse Available Jobs
                </Link>
                <Link
                  href="/bids/my-bids"
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition text-center font-semibold"
                >
                  View My Bids
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity to display</p>
            <Link href="/jobs" className="text-teal-600 hover:underline mt-2 inline-block">
              Browse jobs to get started
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

