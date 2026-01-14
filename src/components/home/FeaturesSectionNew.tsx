'use client';

import { motion } from 'framer-motion';
import { Truck, Shield, RefreshCw, Headphones, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over ৳5000',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure checkout',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day return policy',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Always here to help',
    color: 'bg-purple-100 text-purple-600',
  },
];

export default function FeaturesSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <>
      {/* Features Bar */}
      <section className="py-10 bg-white border-y border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center shrink-0`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">{feature.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 bg-[var(--color-bg-lavender)]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Badge */}
            <span className="inline-block px-4 py-1.5 bg-white text-[var(--color-text)] text-sm font-semibold rounded-full mb-6 shadow-soft">
              ✨ Join Our Newsletter
            </span>

            {/* Headline */}
            <h2 
              className="text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Subscribe & Get 15% Off
            </h2>
            
            <p className="text-[var(--color-text-muted)] mb-8">
              Be the first to know about new arrivals, exclusive offers, and special discounts. 
              Join our community of happy customers!
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-white border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 shadow-soft"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors ${
                  isSubscribed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]'
                }`}
              >
                {isSubscribed ? (
                  'Subscribed! ✓'
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Trust Text */}
            <p className="text-sm text-[var(--color-text-muted)] mt-4">
              No spam, unsubscribe at any time. By subscribing you agree to our Privacy Policy.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
