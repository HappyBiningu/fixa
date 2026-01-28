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
    answer: "Clients post jobs describing what they need done. Workers in the area bid on jobs using credits. Clients review bids and accept the one they prefer. The worker completes the job and gets paid through the platform."
  },
  {
    question: "Is Fixa free to use?",
    answer: "Posting jobs is free for clients. Workers purchase credits to bid on jobs. Workers pay a 15% platform fee on completed jobs. We also offer subscription plans for workers (Pro and Elite) that provide discounts and additional benefits."
  },
  {
    question: "How do credits work?",
    answer: "Credits are purchased through the app and used to bid on jobs. Credit costs vary based on job budget, urgency, and competition. Credits are non-refundable once spent, but you can purchase more at any time."
  },
  {
    question: "How do I get paid as a worker?",
    answer: "After completing a job and receiving client confirmation, payment is added to your wallet. You can request payouts via bank transfer, mobile money, or instant EFT (for Elite workers). Processing times vary by method."
  },
  {
    question: "What if I'm not satisfied with the work?",
    answer: "First, try to resolve the issue directly with the worker. If that doesn't work, you can file a dispute through the platform. Our team will review the dispute and make a decision based on available evidence."
  },
  {
    question: "How are workers verified?",
    answer: "All workers must verify their phone number. We also offer optional ID verification and selfie verification, which increases trust scores and visibility. Workers build reputation through ratings and completed jobs."
  },
  {
    question: "Can I cancel a job?",
    answer: "Clients can cancel jobs before accepting a bid. If a job is cancelled after bids are received, credits spent by workers are not refunded. Workers can withdraw bids before they're accepted, but credits are not refunded."
  },
  {
    question: "What happens if a worker doesn't show up?",
    answer: "If a worker doesn't show up or complete the job, you can file a dispute. The worker may face penalties including account suspension. You may be eligible for a refund depending on the circumstances."
  },
  {
    question: "How do ratings work?",
    answer: "After a job is completed, both clients and workers can rate each other on a 5-star scale with category ratings (quality, professionalism, communication, etc.). Ratings help build trust and improve matching."
  },
  {
    question: "Is my payment information secure?",
    answer: "Yes, we use industry-standard encryption and secure payment processors. We never store your full payment details. All transactions are processed through our secure platform."
  },
  {
    question: "Can I use Fixa outside of South Africa?",
    answer: "Currently, Fixa is focused on South Africa. We're starting in major cities like Pretoria, Johannesburg, Cape Town, and Durban, with plans to expand to more areas."
  },
  {
    question: "How do I delete my account?",
    answer: "You can deactivate or delete your account through your account settings. Note that you must complete any active jobs and resolve pending transactions before deletion. Some information may be retained for legal and accounting purposes."
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about Fixa
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <span className="text-teal-600 text-xl flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-teal-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-700 mb-6">
            Can't find the answer you're looking for? Please reach out to our support team.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Contact Us
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-teal-600 hover:text-teal-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

