'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HeaderClient() {
  const { user, token, logout } = useAuthStore()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Fixa
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-8 items-center">
            {token && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link href="/jobs" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
                  Jobs
                </Link>
                <Link href="/wallet" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
                  Wallet
                </Link>
                <Link href="/notifications" className="text-gray-700 hover:text-teal-600 transition-colors font-medium relative">
                  Notifications
                </Link>
              </>
            )}
            <Link href="/about" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
              About
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
              How It Works
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
              Contact
            </Link>
          </nav>

          <div className="flex gap-4 items-center">
            {token ? (
              <>
                <Link
                  href="/settings"
                  className="hidden md:block text-gray-700 hover:text-teal-600 transition-colors font-medium"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-teal-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-2 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-teal-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-4 pt-4 border-t border-gray-200">
              {token && (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-teal-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/jobs" className="text-gray-700 hover:text-teal-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                    Jobs
                  </Link>
                  <Link href="/wallet" className="text-gray-700 hover:text-teal-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                    Wallet
                  </Link>
                  <Link href="/notifications" className="text-gray-700 hover:text-teal-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                    Notifications
                  </Link>
                  <Link href="/settings" className="text-gray-700 hover:text-teal-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                    Settings
                  </Link>
                </>
              )}
              <Link href="/about" className="text-gray-700 hover:text-teal-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-teal-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-teal-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-teal-600 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
