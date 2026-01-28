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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">Profile not found</div>
      </div>
    )
  }

  const avgRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.overallRating, 0) / ratings.length
    : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {profile.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.fullName || 'User'}
              </h1>
              <p className="text-gray-600 mb-4">{profile.phone}</p>
              {profile.email && (
                <p className="text-gray-600 mb-4">{profile.email}</p>
              )}
              <div className="flex items-center gap-4">
                {avgRating > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-xl font-semibold">{avgRating.toFixed(1)}</span>
                    <span className="text-gray-500">({ratings.length} reviews)</span>
                  </div>
                )}
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold capitalize">
                  {profile.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        {/* Ratings */}
        {ratings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ratings & Reviews ({ratings.length})
            </h2>
            <div className="space-y-4">
              {ratings.map((rating: any) => (
                <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-semibold">{rating.overallRating}</span>
                      </div>
                      {rating.review && (
                        <p className="text-gray-700">{rating.review}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

