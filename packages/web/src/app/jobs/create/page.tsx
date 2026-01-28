'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { jobsApi, categoriesApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function CreateJobPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    budgetType: 'fixed',
    budgetAmount: '',
    budgetMin: '',
    budgetMax: '',
    urgency: 'THIS_WEEK',
    preferredDate: '',
    preferredTime: '',
    locationAddress: '',
    locationLat: -25.7479, // Default to Pretoria
    locationLng: 28.2293,
    visibilityRadius: 10,
    photos: [] as string[],
  })

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoriesApi.getAll()
        setCategories(res.data || [])
      } catch (error) {
        console.error('Failed to load categories')
      }
    }
    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      router.push('/login')
      return
    }

    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      await jobsApi.create({
        ...formData,
        budgetAmount: formData.budgetType === 'fixed' ? parseFloat(formData.budgetAmount) : undefined,
        budgetMin: formData.budgetType === 'negotiable' ? parseFloat(formData.budgetMin) : undefined,
        budgetMax: formData.budgetType === 'negotiable' ? parseFloat(formData.budgetMax) : undefined,
      })
      toast.success('Job posted successfully!')
      router.push('/jobs')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">Describe what you need done and workers will bid on it</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              required
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="e.g., Need a plumber to fix a leaky tap"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={6}
              maxLength={1000}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Describe the job in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.description.length}/1000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <option value="">Select a category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Type *
            </label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={formData.budgetType}
              onChange={(e) => setFormData({ ...formData, budgetType: e.target.value })}
            >
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </div>

          {formData.budgetType === 'fixed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Amount (ZAR) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="500"
                value={formData.budgetAmount}
                onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
              />
            </div>
          )}

          {formData.budgetType === 'negotiable' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum (ZAR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.budgetMin}
                  onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum (ZAR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={formData.budgetMax}
                  onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency *
            </label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
            >
              <option value="TODAY">Today</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="FLEXIBLE">Flexible</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Address *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter job location"
              value={formData.locationAddress}
              onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
            />
            <p className="text-sm text-gray-500 mt-1">
              Workers within {formData.visibilityRadius}km will see this job
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

