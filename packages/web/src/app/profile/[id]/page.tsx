'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { authApi, ratingsApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const params = useParams()
  const { user: currentUser } = useAuthStore()
  const [profile, setProfile] = useState<any>(null)
  const [ratings, setRatings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // In production, use a dedicated profile endpoint
        // For now, use getMe if viewing own profile
        const profileId = params.id as string
        if (profileId === 'me' || profileId === currentUser?.id) {
          const res = await authApi.getMe()
          setProfile(res.data)
        } else {
          // Would fetch other user's profile
          toast.error('Profile not found')
        }

        // Load ratings
        const ratingsRes = await ratingsApi.getReceived()
        setRatings(ratingsRes.data || [])
      } catch (error: any) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [params.id, currentUser])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-xl text-gray-500">Profile not found</div>
      </div>
    )
  }

  const avgRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.overallRating, 0) / ratings.length
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8 card-hover animate-fade-in">
          <div className="flex items-start gap-6 md:gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-lg">
              {profile.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {profile.fullName || 'User'}
              </h1>
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {profile.phone}
              </p>
              {profile.email && (
                <p className="text-gray-600 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {profile.email}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {avgRating > 0 && (
                  <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-200">
                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
                    <span className="text-gray-600">({ratings.length} reviews)</span>
                  </div>
                )}
                <span className="px-4 py-2 bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 rounded-xl text-sm font-semibold capitalize border border-teal-300">
                  {profile.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 card-hover animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{profile.bio}</p>
          </div>
        )}

        {/* Ratings */}
        {ratings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 card-hover animate-slide-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Ratings & Reviews ({ratings.length})
            </h2>
            <div className="space-y-6">
              {ratings.map((rating: any, idx) => (
                <div key={rating.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0 animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= rating.overallRating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xl font-bold text-gray-900">{rating.overallRating}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.review && (
                    <p className="text-gray-700 leading-relaxed">{rating.review}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
