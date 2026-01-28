'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { notificationsApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function NotificationsPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const loadNotifications = async () => {
      try {
        const res = await notificationsApi.getAll()
        setNotifications(res.data || [])
      } catch (error: any) {
        toast.error('Failed to load notifications')
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [token, router])

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id)
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ))
    } catch (error: any) {
      toast.error('Failed to mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.isRead)
      await Promise.all(unread.map(n => notificationsApi.markAsRead(n.id)))
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
      toast.success('All notifications marked as read')
    } catch (error: any) {
      toast.error('Failed to mark all as read')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-xl text-gray-600">Loading notifications...</div>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-10 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-gray-600 text-lg">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl hover-lift font-semibold"
            >
              Mark All Read
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 00-2-2H2a2 2 0 00-2 2v.341C7.67 6.165 12 10.388 12 15v3.159c0 .538-.217 1.085-.595 1.436L10 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h1" />
                </svg>
              </div>
              <p className="text-xl text-gray-500 mb-2">No notifications yet</p>
              <p className="text-gray-400">You'll see notifications about jobs, bids, and messages here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification: any, idx) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer card-hover animate-slide-up ${
                    !notification.isRead ? 'bg-teal-50/50' : ''
                  }`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  onClick={() => {
                    if (!notification.isRead) {
                      handleMarkAsRead(notification.id)
                    }
                    if (notification.actionUrl) {
                      router.push(notification.actionUrl)
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    {!notification.isRead && (
                      <div className="w-3 h-3 bg-teal-600 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                        {notification.title}
                      </h3>
                      <p className="text-gray-700 mb-2 leading-relaxed">{notification.message}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
