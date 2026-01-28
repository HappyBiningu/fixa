import Link from 'next/link'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Get Things Done,{' '}
              <span className="bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                Locally
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-teal-100 leading-relaxed max-w-2xl mx-auto">
              Connect with skilled workers in your neighborhood. Post a job, get bids, and get it done—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                href="/register"
                className="bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-all duration-300 shadow-lg hover:shadow-xl hover-lift text-lg"
              >
                Get Started Free
              </Link>
              <Link
                href="/jobs"
                className="bg-teal-700/80 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-600 transition-all duration-300 border-2 border-white/20 hover-lift text-lg"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              How Fixa Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, fast, and reliable—everything you need to get things done
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100 card-hover animate-slide-up">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Post a Job</h3>
              <p className="text-gray-600 leading-relaxed">
                Describe what you need done. Set your budget and timeline. Workers nearby will see it instantly.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100 card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Receive Bids</h3>
              <p className="text-gray-600 leading-relaxed">
                Skilled workers bid on your job. Review their profiles, ratings, and choose the best fit for you.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-100 card-hover animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Get It Done</h3>
              <p className="text-gray-600 leading-relaxed">
                Accept a bid, chat with your worker, and get the job done. Rate and review when complete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/90 to-teal-800/90 z-10"></div>
            <div className="relative z-20 p-12 md:p-20 text-white">
              <div className="max-w-3xl">
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 text-sm font-semibold uppercase tracking-wider">
                  Success Stories
                </div>
                <h3 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  "Fixa helped me find a reliable plumber in under an hour."
                </h3>
                <p className="text-xl text-teal-100 mb-8">
                  Join thousands of satisfied customers who get things done quickly and efficiently.
                </p>
                <Link
                  href="/register"
                  className="inline-block bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-all duration-300 shadow-lg hover-lift"
                >
                  Start Your Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-teal-100 max-w-2xl mx-auto animate-slide-up">
            Join thousands of people getting things done in their neighborhood.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Link
              href="/register"
              className="bg-white text-teal-600 px-10 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover-lift text-lg"
            >
              Sign Up Free
            </Link>
            <Link
              href="/how-it-works"
              className="bg-teal-700/80 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-semibold hover:bg-teal-600 transition-all duration-300 border-2 border-white/20 hover-lift text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
