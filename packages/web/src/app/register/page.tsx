'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    fullName: '',
    role: 'client',
    password: '',
  })
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreeToTerms) {
      toast.error('You must agree to the Terms & Conditions and Privacy Policy.')
      return
    }
    setLoading(true)

    try {
      await authApi.register(formData)
      toast.success('Registration successful! Please verify your phone.')
      setStep(2)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authApi.verifyPhone({ phone: formData.phone, code: otp })
      toast.success('Phone verified! Please login.')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Create your Fixa account
              </h2>
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                    I want to
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                  >
                    <option value="client">Post jobs (Client)</option>
                    <option value="worker">Find work (Worker)</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="+27123456789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password (optional)
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl border border-teal-100">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    required
                    className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-0.5 flex-shrink-0"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-700 leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms" className="font-semibold text-teal-600 hover:text-teal-700 transition-colors" target="_blank">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="font-semibold text-teal-600 hover:text-teal-700 transition-colors" target="_blank">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !agreeToTerms}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Verify your phone
            </h2>
            <p className="text-gray-600">
              Enter the code sent to {formData.phone}
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleVerify}>
            <div>
              <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-center text-3xl tracking-widest font-mono"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
