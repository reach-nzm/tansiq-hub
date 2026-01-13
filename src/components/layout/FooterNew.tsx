'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  MapPin,
  Phone,
  Mail,
  ArrowUp
} from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'New Arrivals', href: '/products?new=true' },
    { name: 'Best Sellers', href: '/products?bestseller=true' },
    { name: 'On Sale', href: '/products?sale=true' },
    { name: 'Gift Cards', href: '/gift-cards' },
  ],
  categories: [
    { name: 'Organic Foods', href: '/products?category=Organic+Foods' },
    { name: 'Books', href: '/products?category=Books' },
    { name: 'Clothing', href: '/products?category=Clothing' },
    { name: 'Home & Decor', href: '/products?category=Home+%26+Decor' },
    { name: 'Health & Beauty', href: '/products?category=Health+%26+Beauty' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Track Order', href: '/track-order' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' },
    { name: 'Affiliates', href: '/affiliates' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Youtube', icon: Youtube, href: '#' },
];

const paymentMethods = [
  'visa', 'mastercard', 'amex', 'paypal', 'apple-pay'
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--color-bg-cream)]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span 
                className="text-xl font-bold text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Tansiq Hub
              </span>
            </Link>
            <p className="text-[var(--color-text-muted)] text-sm mb-6 max-w-xs">
              Your trusted destination for premium quality products. We bring you the best selection with guaranteed satisfaction.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>123 Commerce St, City, Country</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+1 234 567 890</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                <Mail className="w-4 h-4 shrink-0" />
                <span>hello@tansiqhub.com</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-4">Support</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-[var(--color-text)] mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-[var(--color-text-muted)] text-center md:text-left">
              © {new Date().getFullYear()} Tansiq Hub. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:shadow-soft transition-all"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-text-muted)] mr-2">We accept:</span>
              <div className="flex items-center gap-1">
                {/* Payment icons represented as simple boxes */}
                <div className="w-10 h-6 bg-white rounded border border-[var(--color-border-light)] flex items-center justify-center text-xs font-semibold text-blue-600">
                  VISA
                </div>
                <div className="w-10 h-6 bg-white rounded border border-[var(--color-border-light)] flex items-center justify-center text-xs font-semibold text-orange-500">
                  MC
                </div>
                <div className="w-10 h-6 bg-white rounded border border-[var(--color-border-light)] flex items-center justify-center text-xs font-semibold text-blue-500">
                  PP
                </div>
              </div>
            </div>

            {/* Back to Top */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white hover:bg-[var(--color-primary-light)] transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
