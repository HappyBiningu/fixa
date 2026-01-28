import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Fixa, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              Fixa is a hyperlocal job marketplace platform that connects clients who need tasks completed with skilled workers in their area. 
              We facilitate the connection but are not a party to any agreement between clients and workers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.1 Registration</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>You must be at least 18 years old to use our service</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You must verify your phone number to use the platform</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.2 Account Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>You are responsible for all activities under your account</li>
                  <li>You must not share your account credentials</li>
                  <li>You must notify us immediately of any unauthorized use</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Conduct</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Post false, misleading, or fraudulent information</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to circumvent platform fees or policies</li>
              <li>Use the platform for illegal purposes</li>
              <li>Interfere with the platform's operation</li>
              <li>Collect user information without consent</li>
              <li>Impersonate another person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Job Posting and Bidding</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1 For Clients</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>You may post unlimited jobs</li>
                  <li>You are responsible for accurately describing the work needed</li>
                  <li>You must pay the agreed amount upon job completion</li>
                  <li>You may cancel jobs before accepting a bid</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.2 For Workers</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>You must use credits to bid on jobs</li>
                  <li>Credits are non-refundable once spent</li>
                  <li>You must complete accepted jobs as described</li>
                  <li>You are an independent contractor, not an employee</li>
                  <li>You are responsible for your own taxes and insurance</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payments and Fees</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">6.1 Platform Fees</h3>
                <p className="text-gray-700 leading-relaxed">
                  Workers pay a 15% platform fee on completed jobs. Elite subscribers may receive reduced fees.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">6.2 Credit Purchases</h3>
                <p className="text-gray-700 leading-relaxed">
                  Credits are purchased through our payment processor. All sales are final unless required by law.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">6.3 Payouts</h3>
                <p className="text-gray-700 leading-relaxed">
                  Workers can request payouts from their available balance. Processing times vary by method (2-3 business days for bank transfers).
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disputes</h2>
            <p className="text-gray-700 leading-relaxed">
              If a dispute arises between a client and worker, both parties should attempt to resolve it directly. 
              If unable to resolve, either party may file a dispute through our platform. We will review disputes and make decisions 
              based on available evidence, but we are not obligated to resolve disputes and our decisions are final.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Ratings and Reviews</h2>
            <p className="text-gray-700 leading-relaxed">
              Users may rate and review each other after job completion. Ratings must be honest and accurate. 
              False or defamatory reviews may result in account suspension.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on the Fixa platform, including logos, text, graphics, and software, is the property of Fixa or its licensors 
              and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Fixa acts as a platform connecting clients and workers. We are not responsible for the quality, safety, or legality of services provided. 
              We do not guarantee that jobs will be completed satisfactorily. Users interact at their own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Account Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to suspend or terminate accounts that violate these terms. You may also deactivate or delete your account at any time 
              through your account settings, subject to completion of any active jobs or pending transactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms are governed by the laws of South Africa. Any disputes will be resolved in the courts of South Africa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@fixa.com<br />
                <strong>Phone:</strong> +27 698 944 682<br />
                <strong>Address:</strong> Johannesburg, South Africa
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link href="/" className="text-teal-600 hover:text-teal-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

