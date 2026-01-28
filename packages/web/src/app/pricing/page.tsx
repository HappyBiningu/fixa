import Link from 'next/link'

const workerSubscriptions = [
  {
    tier: 'Free',
    price: 0,
    features: [
      'Browse all jobs',
      'Standard bid visibility',
      'Standard support',
      'Normal credit pricing',
    ],
  },
  {
    tier: 'Pro Worker',
    price: 149.00,
    popular: true,
    features: [
      '20% off all bid credits',
      '1 free Super Bid daily',
      'Early job access (15min)',
      'Priority support',
      'Highlighted profile',
      'Custom badge',
      'Advanced analytics',
      'Unlimited bid revisions',
    ],
  },
  {
    tier: 'Elite Worker',
    price: 299.00,
    features: [
      'All Pro features',
      '30% off all bid credits',
      '3 free Super Bids daily',
      'Exclusive job access',
      'Dedicated account manager',
      'Premium badge',
      'Featured in search results',
      'No platform fees (first R5000/month)',
    ],
  },
]

const clientSubscriptions = [
  {
    tier: 'Basic',
    price: 0,
    features: [
      'Post unlimited jobs',
      'Standard visibility',
      'Basic support',
    ],
  },
  {
    tier: 'Business',
    price: 199.00,
    popular: true,
    features: [
      'All Basic features',
      'Priority job placement',
      'Bulk job posting',
      'Saved worker favorites',
      'Advanced filtering',
      'Recurring job templates',
      'Priority customer support',
      'Monthly usage reports',
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Pricing</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for you
          </p>
        </div>

        {/* Worker Subscriptions */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">For Workers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {workerSubscriptions.map((plan, idx) => (
              <div
                key={plan.tier}
                className={`bg-white rounded-2xl shadow-lg p-8 relative card-hover animate-slide-up ${
                  plan.popular ? 'ring-2 ring-teal-500 shadow-xl scale-105' : ''
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{plan.tier}</h3>
                  <div className="mb-6">
                    {plan.price === 0 ? (
                      <span className="text-5xl font-bold text-gray-900">Free</span>
                    ) : (
                      <>
                        <span className="text-5xl font-bold gradient-text">R{plan.price}</span>
                        <span className="text-gray-600 text-xl">/month</span>
                      </>
                    )}
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start">
                      <div className="w-6 h-6 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full py-4 rounded-xl font-bold text-center transition-all duration-300 shadow-lg hover:shadow-xl hover-lift ${
                    plan.popular
                      ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800'
                      : plan.price === 0
                      ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.price === 0 ? 'Get Started' : 'Subscribe'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Client Subscriptions */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">For Clients</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {clientSubscriptions.map((plan, idx) => (
              <div
                key={plan.tier}
                className={`bg-white rounded-2xl shadow-lg p-8 relative card-hover animate-slide-up ${
                  plan.popular ? 'ring-2 ring-teal-500 shadow-xl scale-105' : ''
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{plan.tier}</h3>
                  <div className="mb-6">
                    {plan.price === 0 ? (
                      <span className="text-5xl font-bold text-gray-900">Free</span>
                    ) : (
                      <>
                        <span className="text-5xl font-bold gradient-text">R{plan.price}</span>
                        <span className="text-gray-600 text-xl">/month</span>
                      </>
                    )}
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start">
                      <div className="w-6 h-6 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full py-4 rounded-xl font-bold text-center transition-all duration-300 shadow-lg hover:shadow-xl hover-lift ${
                    plan.popular
                      ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800'
                      : plan.price === 0
                      ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.price === 0 ? 'Get Started' : 'Subscribe'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Packs */}
        <div className="bg-white rounded-2xl shadow-xl p-10 card-hover animate-slide-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Credit Packs</h2>
          <p className="text-center text-gray-600 mb-8 text-lg">
            One-time purchases for bidding on jobs
          </p>
          <div className="text-center">
            <Link
              href="/credits"
              className="inline-block bg-gradient-to-r from-teal-600 to-teal-700 text-white px-10 py-4 rounded-xl font-bold hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl hover-lift"
            >
              View Credit Packs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
