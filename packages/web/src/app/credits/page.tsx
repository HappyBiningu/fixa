'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { creditsApi } from '@/lib/api'
import toast from 'react-hot-toast'

const creditPacks = [
  {
    id: 'starter_pack',
    name: 'Starter Pack',
    credits: 20,
    price: 49.00,
    bonus: 0,
    popular: false,
  },
  {
    id: 'popular_pack',
    name: 'Popular Pack',
    credits: 50,
    price: 99.00,
    bonus: 5,
    popular: true,
    savings: 'Save 17%',
  },
  {
    id: 'pro_pack',
    name: 'Pro Pack',
    credits: 120,
    price: 199.00,
    bonus: 20,
    popular: false,
    savings: 'Save 30%',
  },
  {
    id: 'mega_pack',
    name: 'Mega Pack',
    credits: 300,
    price: 399.00,
    bonus: 75,
    popular: false,
    savings: 'Save 47%',
    badge: 'BEST VALUE',
  },
]

export default function CreditsPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (pack: typeof creditPacks[0]) => {
    if (!token) {
      router.push('/login')
      return
    }

    setLoading(pack.id)
    try {
      await creditsApi.purchase({
        amount: pack.credits + pack.bonus,
        purchaseId: `purchase_${Date.now()}`,
        packName: pack.name,
      })
      toast.success(`Successfully purchased ${pack.credits + pack.bonus} credits!`)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to purchase credits')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Buy Credits</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Purchase credits to bid on jobs. The more you buy, the more you save!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {creditPacks.map((pack, idx) => (
            <div
              key={pack.id}
              className={`bg-white rounded-2xl shadow-lg p-8 relative card-hover animate-slide-up ${
                pack.popular ? 'ring-2 ring-teal-500 shadow-xl' : ''
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {pack.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    POPULAR
                  </span>
                </div>
              )}
              {pack.badge && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    {pack.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{pack.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold gradient-text">R{pack.price}</span>
                </div>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900">{pack.credits}</span>
                  <span className="text-gray-600 text-lg"> credits</span>
                </div>
                {pack.bonus > 0 && (
                  <div className="text-green-600 font-semibold text-lg">
                    +{pack.bonus} bonus credits
                  </div>
                )}
                {pack.savings && (
                  <div className="text-sm text-gray-600 mt-2 font-medium">{pack.savings}</div>
                )}
              </div>

              <button
                onClick={() => handlePurchase(pack)}
                disabled={loading === pack.id}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover-lift disabled:opacity-50 ${
                  pack.popular
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {loading === pack.id ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-10 card-hover animate-slide-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Credits Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Bid on Jobs</h3>
              <p className="text-gray-600">Use credits to place bids on jobs. Credit costs vary based on job budget, urgency, and competition.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Non-Refundable</h3>
              <p className="text-gray-600">Credits are spent when you bid and are not refunded if your bid is rejected or you withdraw.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Pro Worker Discount</h3>
              <p className="text-gray-600">Upgrade to Pro Worker subscription to get 20% off all bid costs!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
