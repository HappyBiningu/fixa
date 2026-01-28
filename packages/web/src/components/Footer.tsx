import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Fixa</h3>
            <p className="text-sm mb-4">
              Connecting communities through local services, one job at a time.
            </p>
            <div className="space-y-2 text-sm">
              <p>📧 support@fixa.com</p>
              <p>📞 +27 12 345 6789</p>
              <p>📍 Pretoria, South Africa</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-teal-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-teal-400 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-teal-400 transition">
                  Browse Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-teal-400 transition">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-teal-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-teal-400 transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/how-it-works" className="hover:text-teal-400 transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-teal-400 transition">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-teal-400 transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-teal-400 transition">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Fixa. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition text-sm">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition text-sm">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition text-sm">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition text-sm">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

