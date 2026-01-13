import Link from 'next/link';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight
} from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'Organic Foods', href: '/products?category=Organic+Foods' },
    { name: 'Islamic Books', href: '/products?category=Books' },
    { name: 'Modest Clothing', href: '/products?category=Clothing' },
    { name: 'Home & Decor', href: '/products?category=Home+%26+Decor' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
  ],
  support: [
    { name: 'FAQs', href: '/faqs' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns & Refunds', href: '/returns' },
    { name: 'Track Order', href: '/track-order' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary-dark)] text-white">
      {/* Islamic Pattern Divider */}
      <div className="h-8 bg-[var(--color-primary)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 100 32">
            <pattern id="footer-pattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M16 0l16 16-16 16L0 16z" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#footer-pattern)" />
          </svg>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Join Our Community</h3>
              <p className="text-white/70">Subscribe for exclusive offers, new arrivals, and Islamic inspiration.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 rounded-l-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[var(--color-secondary)]"
              />
              <button className="px-6 py-3 bg-[var(--color-secondary)] text-[var(--color-primary-dark)] font-semibold rounded-r-lg hover:bg-[var(--color-secondary-light)] transition-colors flex items-center gap-2">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[var(--color-secondary)] rounded-full flex items-center justify-center">
                <span className="text-[var(--color-primary-dark)] font-bold text-xl">T</span>
              </div>
              <div>
                <span className="text-xl font-bold">Tansiq Hub</span>
                <span className="block text-sm text-white/70">تنسيق هب</span>
              </div>
            </div>
            <p className="text-white/70 mb-6 max-w-sm">
              Your trusted destination for quality Islamic products, organic goods, and modest fashion. 
              Bringing barakah to your everyday life.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary-dark)] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary-dark)] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary-dark)] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary-dark)] transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[var(--color-secondary)]">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[var(--color-secondary)]">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[var(--color-secondary)]">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 text-[var(--color-secondary)]" />
                <span>support@tansiqhub.com</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 text-[var(--color-secondary)]" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-[var(--color-secondary)] flex-shrink-0" />
                <span>123 Islamic Center Rd, Suite 100</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">
              © 2026 Tansiq Hub. All rights reserved. Made with ❤️ and Barakah.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-white/50 text-sm hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
