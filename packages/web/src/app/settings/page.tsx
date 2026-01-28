'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDeactivate = async () => {
    setLoading(true)
    try {
      await authApi.deactivateAccount()
      toast.success('Account deactivated successfully')
      await logout()
      router.push('/')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to deactivate account')
    } finally {
      setLoading(false)
      setShowDeactivateConfirm(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await authApi.deleteAccount()
      toast.success('Account deletion request submitted. We will process it within 7 days.')
      await logout()
      router.push('/')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete account')
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600 text-lg">Manage your account preferences and security</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-8 card-hover animate-slide-up">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Profile Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.fullName || ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={user?.phone || ''}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                />
                <p className="mt-2 text-sm text-gray-500">Phone number cannot be changed</p>
              </div>
              <button className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl hover-lift font-semibold">
                Save Changes
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-8 card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Security</h2>
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Change Password</h3>
                <p className="text-gray-600 mb-4">Update your password to keep your account secure</p>
                <button className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                  Update Password →
                </button>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Two-Factor Authentication</h3>
                <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                <button className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                  Enable 2FA →
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-8 card-hover animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Notifications</h2>
            <div className="space-y-4">
              <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <input type="checkbox" defaultChecked className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <span className="ml-4 text-gray-700 font-medium">Email notifications</span>
              </label>
              <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <input type="checkbox" defaultChecked className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <span className="ml-4 text-gray-700 font-medium">Push notifications</span>
              </label>
              <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <input type="checkbox" defaultChecked className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <span className="ml-4 text-gray-700 font-medium">SMS notifications</span>
              </label>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-8 card-hover animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Privacy</h2>
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <Link href="/privacy" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors flex items-center gap-2 group">
                  View Privacy Policy <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Export</h3>
                <p className="text-gray-600 mb-4">Download a copy of your data</p>
                <button className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                  Export My Data →
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 card-hover animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-red-900 mb-6">Danger Zone</h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Deactivate Account</h3>
                <p className="text-red-700 mb-4 leading-relaxed">
                  Temporarily disable your account. You can reactivate it anytime by logging in.
                </p>
                {!showDeactivateConfirm ? (
                  <button
                    onClick={() => setShowDeactivateConfirm(true)}
                    className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover-lift font-semibold"
                  >
                    Deactivate Account
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-red-800 font-semibold">Are you sure you want to deactivate your account?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDeactivate}
                        disabled={loading}
                        className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 font-semibold"
                      >
                        {loading ? 'Deactivating...' : 'Yes, Deactivate'}
                      </button>
                      <button
                        onClick={() => setShowDeactivateConfirm(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-all duration-300 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-white rounded-xl border border-red-200 pt-6 border-t-2">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Delete Account</h3>
                <p className="text-red-700 mb-4 leading-relaxed">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-700 text-white px-6 py-3 rounded-xl hover:bg-red-800 transition-all duration-300 shadow-lg hover:shadow-xl hover-lift font-semibold"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-red-800 font-semibold mb-2">This action is permanent and cannot be undone.</p>
                    <div>
                      <label className="block text-sm font-semibold text-red-800 mb-2">
                        Please tell us why you're deleting your account (optional)
                      </label>
                      <textarea
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        placeholder="Help us improve by sharing your feedback..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-700 text-white px-6 py-3 rounded-xl hover:bg-red-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 font-semibold"
                      >
                        {loading ? 'Deleting...' : 'Yes, Delete Forever'}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false)
                          setDeleteReason('')
                        }}
                        className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-all duration-300 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
