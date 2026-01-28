import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 max-w-md mx-auto mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover-lift"
          >
            Go Home
          </Link>
          <Link
            href="/jobs"
            className="bg-white text-teal-600 px-8 py-4 rounded-xl border-2 border-teal-600 hover:bg-teal-50 transition-all duration-300 font-semibold"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  )
}
