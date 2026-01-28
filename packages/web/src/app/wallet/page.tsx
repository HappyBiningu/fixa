'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { walletApi, creditsApi } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function WalletPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [wallet, setWallet] = useState<any>(null)
  const [credits, setCredits] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [creditTransactions, setCreditTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPayoutForm, setShowPayoutForm] = useState(false)
  const [payoutData, setPayoutData] = useState({
    amount: '',
    method: 'bank',
    accountNumber: '',
    bankName: '',
    branchCode: '',
  })

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const loadData = async () => {
      try {
        const [walletRes, creditsRes, transactionsRes, creditTransRes] = await Promise.all([
          walletApi.getWallet(),
          creditsApi.getBalance(),
          walletApi.getTransactions(),
          creditsApi.getTransactions(),
        ])

        setWallet(walletRes.data)
        setCredits(creditsRes.data)
        setTransactions(transactionsRes.data || [])
        setCreditTransactions(creditTransRes.data || [])
      } catch (error: any) {
        toast.error('Failed to load wallet data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token, router])

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!payoutData.amount || parseFloat(payoutData.amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (parseFloat(payoutData.amount) > parseFloat(wallet?.balanceAvailable || '0')) {
      toast.error('Insufficient balance')
      return
    }

    try {
      await walletApi.requestPayout({
        amount: parseFloat(payoutData.amount),
        method: payoutData.method,
        details: {
          accountNumber: payoutData.accountNumber,
          bankName: payoutData.bankName,
          branchCode: payoutData.branchCode,
        },
      })
      toast.success('Payout request submitted!')
      setShowPayoutForm(false)
      setPayoutData({ amount: '', method: 'bank', accountNumber: '', bankName: '', branchCode: '' })
      // Reload wallet
      const walletRes = await walletApi.getWallet()
      setWallet(walletRes.data)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to request payout')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-xl text-gray-600">Loading wallet...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 animate-fade-in">Wallet & Credits</h1>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10">
          {/* Credits Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 card-hover animate-slide-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Credits</h2>
            </div>
            <div className="mb-8">
              <p className="text-gray-600 text-sm mb-2 font-medium">Available Credits</p>
              <p className="text-5xl font-bold gradient-text">{credits?.balance || 0}</p>
            </div>
            <div className="space-y-3 text-sm mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between">
                <span className="text-gray-600">Lifetime Purchased</span>
                <span className="font-semibold text-gray-900">{credits?.lifetimePurchased || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lifetime Spent</span>
                <span className="font-semibold text-gray-900">{credits?.lifetimeSpent || 0}</span>
              </div>
            </div>
            <Link
              href="/credits"
              className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl hover-lift"
            >
              Buy More Credits
            </Link>
          </div>

          {/* Wallet Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Wallet</h2>
            </div>
            <div className="mb-8">
              <p className="text-gray-600 text-sm mb-2 font-medium">Available Balance</p>
              <p className="text-5xl font-bold gradient-text">
                R{parseFloat(wallet?.balanceAvailable || '0').toLocaleString()}
              </p>
            </div>
            <div className="space-y-3 text-sm mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-gray-900">R{parseFloat(wallet?.balancePending || '0').toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">On Hold</span>
                <span className="font-semibold text-gray-900">R{parseFloat(wallet?.balanceOnHold || '0').toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-gray-600 font-semibold">Lifetime Earnings</span>
                <span className="font-bold text-teal-600 text-lg">
                  R{parseFloat(wallet?.lifetimeEarnings || '0').toLocaleString()}
                </span>
              </div>
            </div>
            {parseFloat(wallet?.balanceAvailable || '0') > 0 && (
              <button
                onClick={() => setShowPayoutForm(true)}
                className="block w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl hover-lift"
              >
                Request Payout
              </button>
            )}
          </div>
        </div>

        {/* Payout Form */}
        {showPayoutForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-10 card-hover animate-slide-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Request Payout</h2>
            <form onSubmit={handlePayout} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (ZAR) *
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  max={wallet?.balanceAvailable || '0'}
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  value={payoutData.amount}
                  onChange={(e) => setPayoutData({ ...payoutData, amount: e.target.value })}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Available: R{parseFloat(wallet?.balanceAvailable || '0').toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                  value={payoutData.method}
                  onChange={(e) => setPayoutData({ ...payoutData, method: e.target.value })}
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="mobile_money">Mobile Money</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  value={payoutData.accountNumber}
                  onChange={(e) => setPayoutData({ ...payoutData, accountNumber: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    value={payoutData.bankName}
                    onChange={(e) => setPayoutData({ ...payoutData, bankName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Branch Code *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    value={payoutData.branchCode}
                    onChange={(e) => setPayoutData({ ...payoutData, branchCode: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover-lift"
                >
                  Request Payout
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayoutForm(false)}
                  className="px-6 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Transactions */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 card-hover animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Wallet Transactions</h2>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p>No transactions yet</p>
                </div>
              ) : (
                transactions.map((tx: any) => (
                  <div key={tx.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{tx.description || tx.type}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className={`font-bold text-lg ${
                        parseFloat(tx.amount) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {parseFloat(tx.amount) >= 0 ? '+' : ''}R{Math.abs(parseFloat(tx.amount || '0')).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Credit Transactions</h2>
            <div className="space-y-4">
              {creditTransactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p>No transactions yet</p>
                </div>
              ) : (
                creditTransactions.map((tx: any) => (
                  <div key={tx.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{tx.description || tx.type}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className={`font-bold text-lg ${
                        tx.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.amount >= 0 ? '+' : ''}{tx.amount} credits
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
