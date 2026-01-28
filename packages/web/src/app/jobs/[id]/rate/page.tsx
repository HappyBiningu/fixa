'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { jobsApi, ratingsApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function RateJobPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState({
    overallRating: 5,
    qualityRating: 5,
    professionalismRating: 5,
    communicationRating: 5,
    punctualityRating: 5,
    valueRating: 5,
    review: '',
  })

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const loadJob = async () => {
      try {
        const res = await jobsApi.getById(params.id as string)
        setJob(res.data)
      } catch (error: any) {
        toast.error('Failed to load job')
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [params.id, token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!job) return

    const jobData = job.job || job
    const otherUserId = jobData.clientId === user?.id 
      ? jobData.hiredWorkerId 
      : jobData.clientId

    if (!otherUserId) {
      toast.error('Unable to determine user to rate')
      return
    }

    setSubmitting(true)
    try {
      await ratingsApi.create(params.id as string, {
        toUserId: otherUserId,
        ...rating,
      })
      toast.success('Rating submitted!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit rating')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!job) return null

  const jobData = job.job || job
  const otherUser = jobData.clientId === user?.id 
    ? { name: 'Worker' }
    : { name: 'Client' }

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (val: number) => void; label: string }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none transform transition-transform hover:scale-110"
          >
            <svg
              className={`w-10 h-10 transition-colors ${
                star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Rate {otherUser.name}</h1>
        <p className="text-gray-600 mb-10 text-lg">
          Job: <strong className="text-gray-900">{jobData.title}</strong>
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-8 card-hover">
          <StarRating
            value={rating.overallRating}
            onChange={(val) => setRating({ ...rating, overallRating: val })}
            label="Overall Rating *"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <StarRating
              value={rating.qualityRating}
              onChange={(val) => setRating({ ...rating, qualityRating: val })}
              label="Quality of Work"
            />
            <StarRating
              value={rating.professionalismRating}
              onChange={(val) => setRating({ ...rating, professionalismRating: val })}
              label="Professionalism"
            />
            <StarRating
              value={rating.communicationRating}
              onChange={(val) => setRating({ ...rating, communicationRating: val })}
              label="Communication"
            />
            <StarRating
              value={rating.punctualityRating}
              onChange={(val) => setRating({ ...rating, punctualityRating: val })}
              label="Punctuality"
            />
            <StarRating
              value={rating.valueRating}
              onChange={(val) => setRating({ ...rating, valueRating: val })}
              label="Value for Money"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Review (Optional)
            </label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none"
              placeholder="Share your experience..."
              value={rating.review}
              onChange={(e) => setRating({ ...rating, review: e.target.value })}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
