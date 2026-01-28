'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

export default function HeaderClient() {
  const { user, token, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-teal-600">
            Fixa
          </Link>

          <nav className="hidden md:flex gap-6 items-center">
            {token && (
              <Link href="/dashboard" className="text-gray-700 hover:text-teal-600 transition">
                Dashboard
              </Link>
            )}
            <Link href="/about" className="text-gray-700 hover:text-teal-600 transition">
              About
            </Link>
            <Link href="/jobs" className="text-gray-700 hover:text-teal-600 transition">
              Jobs
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-teal-600 transition">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-teal-600 transition">
              Contact
            </Link>
          </nav>

          <div className="flex gap-4 items-center">
            {token ? (
              <>
                <Link
                  href="/settings"
                  className="text-gray-700 hover:text-teal-600 transition"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-teal-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

