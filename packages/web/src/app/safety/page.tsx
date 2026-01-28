import Link from 'next/link'

const safetySections = [
  {
    title: 'Verify Workers',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    items: [
      'Check worker ratings and reviews before hiring',
      'Look for verified badges (phone, ID, selfie verification)',
      'Review worker\'s portfolio and completed jobs',
      'Check response time and acceptance rate',
    ],
  },
  {
    title: 'Communicate Safely',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    items: [
      'Use Fixa\'s in-app messaging system only',
      'Never share personal information like bank details outside the platform',
      'Keep all communication on the platform for your protection',
      'Report any suspicious behavior immediately',
    ],
  },
  {
    title: 'Payment Safety',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    items: [
      'All payments are processed securely through Fixa',
      'Never pay workers directly outside the platform',
      'Only mark jobs as complete after satisfactory work',
      'Use the dispute system if there are any issues',
    ],
  },
  {
    title: 'Meeting in Person',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    items: [
      'Meet in a public place or have someone else present',
      'Share your location with a trusted friend or family member',
      'Trust your instincts - if something feels wrong, cancel',
      'Take photos before and after work is completed',
    ],
  },
]

const workerSections = [
  {
    title: 'Verify Jobs',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    items: [
      'Read job descriptions carefully before bidding',
      'Check client ratings and history',
      'Ask clarifying questions if job details are unclear',
      'Be cautious of jobs with unusually high pay for simple tasks',
    ],
  },
  {
    title: 'Professional Conduct',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    items: [
      'Arrive on time and communicate delays promptly',
      'Bring necessary tools and equipment',
      'Complete work as described in your bid',
      'Take photos of completed work for your portfolio',
    ],
  },
  {
    title: 'Payment Protection',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    items: [
      'All payments are processed through Fixa - never accept cash outside the platform',
      'Wait for client confirmation before considering job complete',
      'Use the dispute system if payment issues arise',
      'Keep records of all communications and work completed',
    ],
  },
  {
    title: 'Personal Safety',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    items: [
      'Let someone know where you\'re going and when you\'ll return',
      'Trust your instincts - leave if you feel unsafe',
      'Keep your phone charged and accessible',
      'Report any harassment or inappropriate behavior immediately',
    ],
  },
]

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Safety Tips</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Your safety is our priority. Follow these guidelines for a secure experience.
          </p>
        </div>

        <div className="space-y-12">
          {/* For Clients */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 card-hover animate-slide-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">For Clients</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {safetySections.map((section, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-gradient-to-br from-teal-50 to-white border border-teal-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <svg className="w-5 h-5 text-teal-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* For Workers */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 card-hover animate-slide-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">For Workers</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {workerSections.map((section, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-gradient-to-br from-teal-50 to-white border border-teal-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <svg className="w-5 h-5 text-teal-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Reporting */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 md:p-10 card-hover animate-slide-up">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-red-900 mb-4">Report Issues</h2>
                <p className="text-red-800 mb-6 text-lg">
                  If you encounter any safety concerns, harassment, or suspicious activity, report it immediately:
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Use the "Report" button on any user profile or message',
                    'File a dispute through the job details page',
                    'Contact support at support@fixa.com or +27 698 944 682',
                    'In case of emergency, contact local authorities immediately',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start text-red-800">
                      <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="inline-block bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover-lift font-semibold"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Trust & Verification */}
          <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-8 md:p-10 border border-teal-200 card-hover animate-slide-up">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Build Trust</h2>
                <p className="text-gray-700 mb-6 text-lg">
                  Fixa offers several verification options to help build trust:
                </p>
                <ul className="space-y-3">
                  {[
                    'Phone Verification: Required for all users',
                    'ID Verification: Optional but increases trust score',
                    'Selfie Verification: Matches your photo to your ID',
                    'Ratings & Reviews: Build reputation through completed jobs',
                    'Badges: Earn badges for reliability, fast response, and more',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start text-gray-700">
                      <svg className="w-5 h-5 text-teal-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
