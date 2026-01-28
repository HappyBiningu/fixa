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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  const isWorker = user?.role === 'worker' || user?.role === 'both'
  const isClient = user?.role === 'client' || user?.role === 'both'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullName || 'User'}!
          </h1>
          <p className="text-xl text-gray-600">Here's an overview of your activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {isClient && (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-slide-up">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1 font-medium">Active Jobs</p>
                    <p className="text-4xl font-bold text-gray-900">{stats.activeJobs || 0}</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <Link href="/jobs/my-jobs" className="text-teal-600 text-sm mt-4 inline-block hover:text-teal-700 font-medium transition-colors flex items-center gap-1 group">
                  View all <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1 font-medium">Completed Jobs</p>
                    <p className="text-4xl font-bold text-gray-900">{stats.completedJobs || 0}</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <Link href="/jobs/my-jobs?status=completed" className="text-teal-600 text-sm mt-4 inline-block hover:text-teal-700 font-medium transition-colors flex items-center gap-1 group">
                  View all <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </>
          )}

          {isWorker && (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1 font-medium">Credits</p>
                    <p className="text-4xl font-bold text-gray-900">{stats.credits || 0}</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <Link href="/credits" className="text-teal-600 text-sm mt-4 inline-block hover:text-teal-700 font-medium transition-colors flex items-center gap-1 group">
                  Buy more <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1 font-medium">Wallet Balance</p>
                    <p className="text-4xl font-bold text-gray-900">
                      R{parseFloat(stats.wallet || '0').toLocaleString()}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
                <Link href="/wallet" className="text-teal-600 text-sm mt-4 inline-block hover:text-teal-700 font-medium transition-colors flex items-center gap-1 group">
                  View wallet <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {isClient && (
            <div className="bg-white rounded-2xl shadow-lg p-8 card-hover animate-slide-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  href="/jobs/create"
                  className="block w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl hover-lift"
                >
                  Post a New Job
                </Link>
                <Link
                  href="/jobs/my-jobs"
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 text-center font-semibold"
                >
                  View My Jobs
                </Link>
                <Link
                  href="/wallet"
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 text-center font-semibold"
                >
                  View Wallet
                </Link>
              </div>
            </div>
          )}

          {isWorker && (
            <div className="bg-white rounded-2xl shadow-lg p-8 card-hover animate-slide-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  href="/jobs"
                  className="block w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl hover-lift"
                >
                  Browse Available Jobs
                </Link>
                <Link
                  href="/bids/my-bids"
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 text-center font-semibold"
                >
                  View My Bids
                </Link>
                <Link
                  href="/wallet"
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 text-center font-semibold"
                >
                  View Wallet
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-8 card-hover animate-slide-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="text-center py-12 text-gray-500">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg mb-2">No recent activity to display</p>
            <Link href="/jobs" className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-2 group">
              Browse jobs to get started <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
