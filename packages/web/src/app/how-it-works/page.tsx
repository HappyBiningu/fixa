import Link from 'next/link'

const steps = [
  {
    number: 1,
    title: 'Post a Job',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    description: 'Create a detailed job posting describing what you need done. Include:',
    items: [
      'Clear job title and description',
      'Your budget (fixed, hourly, or negotiable)',
      'When you need it done (urgency level)',
      'Job location',
      'Photos if helpful (optional)',
    ],
    note: 'Your job will be visible to workers within your chosen radius.',
  },
  {
    number: 2,
    title: 'Review Bids',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    description: 'Workers in your area will bid on your job. Each bid includes:',
    items: [
      'Worker\'s proposed price',
      'How they\'ll complete the job',
      'Estimated time to complete',
      'Their availability',
      'Worker\'s rating and experience',
    ],
    note: 'Review all bids and compare workers\' profiles, ratings, and proposals.',
  },
  {
    number: 3,
    title: 'Accept a Bid',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'Choose the worker that best fits your needs and accept their bid. Once accepted:',
    items: [
      'The worker is notified immediately',
      'You can chat with them through the platform',
      'The job status changes to "In Progress"',
      'Other bids are automatically declined',
    ],
  },
  {
    number: 4,
    title: 'Get It Done & Rate',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    description: 'After the work is completed:',
    items: [
      'Review the completed work',
      'Mark the job as complete when satisfied',
      'Rate and review the worker',
      'Payment is automatically processed',
    ],
    note: 'Your feedback helps other clients and helps workers build their reputation.',
  },
]

const workerSteps = [
  {
    number: 1,
    title: 'Browse Jobs',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    description: 'Explore available jobs in your area. You can:',
    items: [
      'Filter by category, distance, and budget',
      'View jobs on a map or in a list',
      'See job details, location, and urgency',
      'Check how many other workers have bid',
    ],
  },
  {
    number: 2,
    title: 'Place Bids',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'When you find a job you want, place a bid using credits:',
    items: [
      'Write a compelling proposal explaining your approach',
      'Set your proposed price',
      'Estimate how long it will take',
      'Indicate your availability',
      'Credits are deducted when you bid (non-refundable)',
    ],
    note: 'Credit costs vary based on job budget, urgency, and competition.',
  },
  {
    number: 3,
    title: 'Get Hired',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'If the client accepts your bid:',
    items: [
      'You\'ll receive a notification',
      'Chat with the client to coordinate details',
      'Complete the work as described',
      'Take photos of your work for your portfolio',
    ],
  },
  {
    number: 4,
    title: 'Get Paid',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    description: 'After completing the work:',
    items: [
      'Client confirms completion',
      'Payment is added to your wallet (minus 15% platform fee)',
      'You can request payouts via bank transfer or mobile money',
      'Rate and review the client',
      'Build your reputation with positive reviews',
    ],
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">How Fixa Works</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            A simple guide to getting things done in your neighborhood
          </p>
        </div>

        {/* For Clients */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">For Clients</h2>
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 md:p-10 card-hover animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex items-start gap-6 md:gap-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl font-bold text-gray-300">0{step.number}</span>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {step.items.map((item, i) => (
                        <li key={i} className="flex items-start text-gray-700">
                          <svg className="w-5 h-5 text-teal-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {step.note && (
                      <p className="text-gray-600 mt-4 italic">
                        {step.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* For Workers */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">For Workers</h2>
          <div className="space-y-8">
            {workerSteps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 md:p-10 card-hover animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex items-start gap-6 md:gap-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl font-bold text-gray-300">0{step.number}</span>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {step.items.map((item, i) => (
                        <li key={i} className="flex items-start text-gray-700">
                          <svg className="w-5 h-5 text-teal-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {step.note && (
                      <p className="text-gray-600 mt-4 italic">
                        {step.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white rounded-3xl p-10 md:p-12 text-center relative overflow-hidden card-hover animate-slide-up">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl md:text-2xl mb-10 text-teal-100 max-w-2xl mx-auto">
              Join Fixa today and start connecting with your local community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-teal-600 px-10 py-4 rounded-xl font-bold hover:bg-teal-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover-lift text-lg"
              >
                Sign Up Free
              </Link>
              <Link
                href="/contact"
                className="bg-teal-700/80 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-bold hover:bg-teal-600 transition-all duration-300 border-2 border-white/20 hover-lift text-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
