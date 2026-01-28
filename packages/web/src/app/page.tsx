import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 to-teal-800 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get Things Done, Locally
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-teal-100">
              Connect with skilled workers in your neighborhood. Post a job, get bids, and get it done.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition"
              >
                Get Started
              </Link>
              <Link
                href="/jobs"
                className="bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            How Fixa Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-2xl font-semibold mb-3">Post a Job</h3>
              <p className="text-gray-600">
                Describe what you need done. Set your budget and timeline. Workers nearby will see it.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-semibold mb-3">Receive Bids</h3>
              <p className="text-gray-600">
                Skilled workers bid on your job using credits. Review their profiles and choose the best fit.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-semibold mb-3">Get It Done</h3>
              <p className="text-gray-600">
                Accept a bid, chat with your worker, and get the job done. Rate and review when complete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://pixabay.com/get/gede68be324dcd92fbf0940dd43b6c8e57b3c3bd5a2b54910e819888fb5ea5eb14a54abd55f072418870a027c790d5aee84d920a464fbd3d9d27e1a2f78de85cb_1280.jpg"
              alt="Workers collaborating"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-8 left-8 right-8 z-20 text-white">
              <p className="text-sm font-bold uppercase tracking-widest text-teal-300 mb-2">Success Stories</p>
              <h3 className="text-2xl md:text-3xl font-display font-bold">"Fixa helped me find a reliable plumber in under an hour."</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-teal-100">
            Join thousands of people getting things done in their neighborhood.
          </p>
          <Link
            href="/register"
            className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition inline-block"
          >
            Sign Up Free
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}

