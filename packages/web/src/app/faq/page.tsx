'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "How does Fixa work?",
    answer: "Clients post jobs describing what they need done. Workers in the area bid on jobs using credits. Clients review bids and accept the one they prefer. The worker completes the job and gets paid through the platform.",
  },
  {
    question: "Is Fixa free to use?",
    answer: "Posting jobs is free for clients. Workers purchase credits to bid on jobs. Workers pay a 15% platform fee on completed jobs. We also offer subscription plans for workers (Pro and Elite) that provide discounts and additional benefits.",
  },
  {
    question: "How do credits work?",
    answer: "Credits are purchased through the app and used to bid on jobs. Credit costs vary based on job budget, urgency, and competition. Credits are non-refundable once spent, but you can purchase more at any time.",
  },
  {
    question: "How do I get paid as a worker?",
    answer: "After completing a job and receiving client confirmation, payment is added to your wallet. You can request payouts via bank transfer, mobile money, or instant EFT (for Elite workers). Processing times vary by method.",
  },
  {
    question: "What if I'm not satisfied with the work?",
    answer: "First, try to resolve the issue directly with the worker. If that doesn't work, you can file a dispute through the platform. Our team will review the dispute and make a decision based on available evidence.",
  },
  {
    question: "How are workers verified?",
    answer: "All workers must verify their phone number. We also offer optional ID verification and selfie verification, which increases trust scores and visibility. Workers build reputation through ratings and completed jobs.",
  },
  {
    question: "Can I cancel a job?",
    answer: "Clients can cancel jobs before accepting a bid. If a job is cancelled after bids are received, credits spent by workers are not refunded. Workers can withdraw bids before they're accepted, but credits are not refunded.",
  },
  {
    question: "What happens if a worker doesn't show up?",
    answer: "If a worker doesn't show up or complete the job, you can file a dispute. The worker may face penalties including account suspension. You may be eligible for a refund depending on the circumstances.",
  },
  {
    question: "How do ratings work?",
    answer: "After a job is completed, both clients and workers can rate each other on a 5-star scale with category ratings (quality, professionalism, communication, etc.). Ratings help build trust and improve matching.",
  },
  {
    question: "Is my payment information secure?",
    answer: "Yes, we use industry-standard encryption and secure payment processors. We never store your full payment details. All transactions are processed through our secure platform.",
  },
  {
    question: "Can I use Fixa outside of South Africa?",
    answer: "Currently, Fixa is available in South Africa only. We're working on expanding to other countries. Sign up for our newsletter to be notified when we launch in your area.",
  },
  {
    question: "How do I contact support?",
    answer: "You can contact our support team via email at support@fixa.com, phone at +27 698 944 682, or through the contact form on our website. We're available Monday-Friday 9 AM-6 PM and Saturday 10 AM-4 PM.",
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Fixa
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <svg
                  className={`w-6 h-6 text-teal-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 animate-fade-in">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-br from-teal-50 to-white rounded-2xl p-10 text-center border border-teal-100 card-hover animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Please reach out to our friendly team.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl hover-lift font-semibold"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
