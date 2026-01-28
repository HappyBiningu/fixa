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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.fullName || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  defaultValue={user?.phone || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <p className="mt-1 text-sm text-gray-500">Phone number cannot be changed</p>
              </div>
              <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition">
                Save Changes
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Change Password</h3>
                <button className="text-teal-600 hover:text-teal-700 font-medium">
                  Update Password
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Two-Factor Authentication</h3>
                <p className="text-gray-600 mb-2">Add an extra layer of security to your account</p>
                <button className="text-teal-600 hover:text-teal-700 font-medium">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notifications</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <span className="ml-3 text-gray-700">Email notifications</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <span className="ml-3 text-gray-700">Push notifications</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                <span className="ml-3 text-gray-700">SMS notifications</span>
              </label>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy</h2>
            <div className="space-y-4">
              <div>
                <Link href="/privacy" className="text-teal-600 hover:text-teal-700 font-medium">
                  View Privacy Policy →
                </Link>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Export</h3>
                <p className="text-gray-600 mb-2">Download a copy of your data</p>
                <button className="text-teal-600 hover:text-teal-700 font-medium">
                  Export My Data
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-red-900 mb-4">Danger Zone</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Deactivate Account</h3>
                <p className="text-red-700 mb-4">
                  Temporarily disable your account. You can reactivate it anytime by logging in.
                </p>
                {!showDeactivateConfirm ? (
                  <button
                    onClick={() => setShowDeactivateConfirm(true)}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Deactivate Account
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-red-800 font-medium">Are you sure you want to deactivate your account?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDeactivate}
                        disabled={loading}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {loading ? 'Deactivating...' : 'Yes, Deactivate'}
                      </button>
                      <button
                        onClick={() => setShowDeactivateConfirm(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Delete Account</h3>
                <p className="text-red-700 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-red-800 font-medium mb-2">This action is permanent and cannot be undone.</p>
                    <div>
                      <label className="block text-sm font-medium text-red-800 mb-2">
                        Please tell us why you're deleting your account (optional)
                      </label>
                      <textarea
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Help us improve by sharing your feedback..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition disabled:opacity-50"
                      >
                        {loading ? 'Deleting...' : 'Yes, Delete Forever'}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false)
                          setDeleteReason('')
                        }}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
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

