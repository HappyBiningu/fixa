'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { messagesApi, jobsApi } from '@/lib/api'
import toast from 'react-hot-toast'

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading chat...</div>
      </div>
    )
  }

  const otherUser = job?.job?.hiredWorkerId === user?.id 
    ? job?.client 
    : job?.job?.hiredWorkerId

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="text-teal-600 hover:text-teal-700 mb-2"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Chat: {job?.job?.title || 'Job'}
              </h1>
              <p className="text-sm text-gray-500">
                {jobData?.hiredWorkerId === user?.id ? 'Client' : 'Worker'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message: any) => {
              const isOwn = message.senderId === user?.id
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwn
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-gray-900 shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? 'text-teal-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString()}
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
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

