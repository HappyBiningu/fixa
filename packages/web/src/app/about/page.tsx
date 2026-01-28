import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">About Fixa</h1>
          <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Connecting communities through local services, one job at a time.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 card-hover animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              Fixa was born from a simple idea: making it easier for people to get things done in their neighborhoods 
              while creating opportunities for skilled workers to earn a living.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              We believe in building stronger local communities by connecting people who need help with those who can provide it. 
              Our platform empowers workers to showcase their skills and helps clients find reliable, local service providers quickly and easily.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 card-hover animate-slide-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Post a Job</h3>
                <p className="text-gray-600 leading-relaxed">
                  Clients describe what they need done, set a budget, and post the job to the platform.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Workers Bid</h3>
                <p className="text-gray-600 leading-relaxed">
                  Skilled workers in the area bid on jobs using credits, creating a competitive marketplace.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Get It Done</h3>
                <p className="text-gray-600 leading-relaxed">
                  Clients choose the best bid, work gets completed, and both parties rate each other.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 card-hover animate-slide-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-gradient-to-br from-teal-50 to-white border border-teal-100">
                <div className="w-14 h-14 mb-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Community First</h3>
                <p className="text-gray-700 leading-relaxed">
                  We're building a platform that strengthens local communities by keeping work and money in the neighborhood.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-teal-50 to-white border border-teal-100">
                <div className="w-14 h-14 mb-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Trust & Safety</h3>
                <p className="text-gray-700 leading-relaxed">
                  We prioritize the safety and security of our users through verification, ratings, and a robust dispute resolution system.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-teal-50 to-white border border-teal-100">
                <div className="w-14 h-14 mb-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fair Opportunities</h3>
                <p className="text-gray-700 leading-relaxed">
                  We provide equal opportunities for all workers, regardless of background, and ensure fair pricing through competitive bidding.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-teal-50 to-white border border-teal-100">
                <div className="w-14 h-14 mb-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-700 leading-relaxed">
                  We continuously improve our platform to make it easier, faster, and more efficient for both clients and workers.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 card-hover animate-slide-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Why Choose Fixa?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Hyperlocal Focus', desc: 'Find workers in your immediate area, reducing travel time and costs.' },
                { title: 'Competitive Pricing', desc: 'Workers bid on jobs, ensuring you get the best value.' },
                { title: 'Verified Workers', desc: 'All workers go through phone verification and build trust through ratings.' },
                { title: 'Secure Payments', desc: 'All transactions are processed securely through our platform.' },
                { title: '24/7 Support', desc: 'Our team is here to help with any questions or issues.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-teal-50 transition-colors">
                  <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-gray-900 text-lg block mb-1">{item.title}</strong>
                    <span className="text-gray-700">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Join the Fixa Community</h2>
          <p className="text-xl md:text-2xl mb-10 text-teal-100 max-w-2xl mx-auto">
            Whether you need work done or want to find work, Fixa is here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-teal-600 px-10 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover-lift text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/contact"
              className="bg-teal-700/80 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-semibold hover:bg-teal-600 transition-all duration-300 border-2 border-white/20 hover-lift text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
