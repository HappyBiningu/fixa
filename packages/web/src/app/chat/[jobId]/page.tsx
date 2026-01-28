'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { messagesApi, jobsApi } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const jobId = params.jobId as string

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const loadData = async () => {
      try {
        const [messagesRes, jobRes] = await Promise.all([
          messagesApi.getMessages(jobId),
          jobsApi.getById(jobId).catch(() => ({ data: null })),
        ])
        setMessages(messagesRes.data || [])
        setJob(jobRes.data)
      } catch (error: any) {
        toast.error('Failed to load messages')
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      messagesApi.getMessages(jobId)
        .then((res) => setMessages(res.data || []))
        .catch(() => {})
    }, 5000)

    return () => clearInterval(interval)
  }, [jobId, token, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const jobData = job?.job || job
      const recipientId = jobData?.clientId === user?.id 
        ? jobData?.hiredWorkerId 
        : jobData?.clientId
      
      if (!recipientId) {
        toast.error('Cannot send message: recipient not found.')
        setSending(false)
        return
      }

      await messagesApi.sendMessage(jobId, {
        content: newMessage,
        recipientId,
      })
      setNewMessage('')
      // Reload messages
      const messagesRes = await messagesApi.getMessages(jobId)
      setMessages(messagesRes.data || [])
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-xl text-gray-600">Loading chat...</div>
      </div>
    )
  }

  const jobData = job?.job || job
  const otherUser = jobData?.hiredWorkerId === user?.id 
    ? jobData?.client 
    : jobData?.hiredWorker

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-teal-600 hover:text-teal-700 transition-colors p-2 hover:bg-teal-50 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {jobData?.title || 'Job Chat'}
                </h1>
                <p className="text-sm text-gray-500">
                  Chatting with {otherUser?.fullName || 'User'}
                </p>
              </div>
            </div>
            <Link
              href={`/jobs/${jobId}`}
              className="text-teal-600 hover:text-teal-700 font-semibold transition-colors flex items-center gap-2"
            >
              View Job
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500 text-xl mb-2">No messages yet</p>
              <p className="text-gray-400">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message: any, idx) => {
              const isOwn = message.senderId === user?.id
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl ${
                      isOwn
                        ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg'
                        : 'bg-white text-gray-900 shadow-md'
                    }`}
                  >
                    {!isOwn && (
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {message.sender?.fullName || 'User'}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        isOwn ? 'text-teal-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
