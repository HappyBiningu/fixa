import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Fixa</h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Connecting communities through local services, one job at a time.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Fixa was born from a simple idea: making it easier for people to get things done in their neighborhoods 
              while creating opportunities for skilled workers to earn a living.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe in building stronger local communities by connecting people who need help with those who can provide it. 
              Our platform empowers workers to showcase their skills and helps clients find reliable, local service providers quickly and easily.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-xl font-semibold mb-3">Post a Job</h3>
                <p className="text-gray-600">
                  Clients describe what they need done, set a budget, and post the job to the platform.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-3">Workers Bid</h3>
                <p className="text-gray-600">
                  Skilled workers in the area bid on jobs using credits, creating a competitive marketplace.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-3">Get It Done</h3>
                <p className="text-gray-600">
                  Clients choose the best bid, work gets completed, and both parties rate each other.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">🏘️ Community First</h3>
                <p className="text-gray-700">
                  We're building a platform that strengthens local communities by keeping work and money in the neighborhood.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">🤝 Trust & Safety</h3>
                <p className="text-gray-700">
                  We prioritize the safety and security of our users through verification, ratings, and a robust dispute resolution system.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">💼 Fair Opportunities</h3>
                <p className="text-gray-700">
                  We provide equal opportunities for all workers, regardless of background, and ensure fair pricing through competitive bidding.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">🚀 Innovation</h3>
                <p className="text-gray-700">
                  We continuously improve our platform to make it easier, faster, and more efficient for both clients and workers.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Fixa?</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-teal-600 text-2xl mr-3">✓</span>
                <div>
                  <strong className="text-gray-900">Hyperlocal Focus:</strong>
                  <span className="text-gray-700"> Find workers in your immediate area, reducing travel time and costs.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 text-2xl mr-3">✓</span>
                <div>
                  <strong className="text-gray-900">Competitive Pricing:</strong>
                  <span className="text-gray-700"> Workers bid on jobs, ensuring you get the best value.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 text-2xl mr-3">✓</span>
                <div>
                  <strong className="text-gray-900">Verified Workers:</strong>
                  <span className="text-gray-700"> All workers go through phone verification and build trust through ratings.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 text-2xl mr-3">✓</span>
                <div>
                  <strong className="text-gray-900">Secure Payments:</strong>
                  <span className="text-gray-700"> All transactions are processed securely through our platform.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 text-2xl mr-3">✓</span>
                <div>
                  <strong className="text-gray-900">24/7 Support:</strong>
                  <span className="text-gray-700"> Our team is here to help with any questions or issues.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Fixa Community</h2>
          <p className="text-xl mb-8 text-teal-100">
            Whether you need work done or want to find work, Fixa is here for you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition"
            >
              Get Started
            </Link>
            <Link
              href="/contact"
              className="bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

