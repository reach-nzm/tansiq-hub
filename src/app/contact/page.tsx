'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Check
} from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    details: ['support@tansiqhub.com', 'business@tansiqhub.com'],
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: ['123 Blessed Lane', 'Islamic District, City 12345'],
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat - Sun: 10:00 AM - 4:00 PM'],
  },
];

const faqs = [
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers. All transactions are secure and encrypted.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for all unused items in original packaging. Please contact support to initiate a return.',
  },
  {
    question: 'Are all products halal certified?',
    answer: 'Yes, all our food products are halal certified from recognized authorities. We take halal compliance very seriously.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="relative bg-[var(--color-primary)] py-20 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-white/80 mb-2">تواصل معنا</p>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl mb-4">
                  <info.icon className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-bold text-[var(--color-text)] mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-[var(--color-text-light)] text-sm">
                    {detail}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">
                Send us a Message
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-green-600">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-[var(--color-primary)] hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
                      placeholder="Write your message here..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Social & FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Social Media */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">
                  Connect With Us
                </h3>
                <p className="text-[var(--color-text-light)] mb-6">
                  Follow us on social media for updates, inspiration, and special offers.
                </p>
                <div className="flex gap-4">
                  {[
                    { icon: Facebook, color: '#1877f2', label: 'Facebook' },
                    { icon: Instagram, color: '#e4405f', label: 'Instagram' },
                    { icon: Twitter, color: '#1da1f2', label: 'Twitter' },
                    { icon: Youtube, color: '#ff0000', label: 'YouTube' },
                  ].map((social) => (
                    <motion.a
                      key={social.label}
                      href="#"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center w-12 h-12 rounded-xl transition-colors"
                      style={{ backgroundColor: `${social.color}20` }}
                    >
                      <social.icon className="w-6 h-6" style={{ color: social.color }} />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-100 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-[var(--color-text)]">
                          {faq.question}
                        </span>
                        <MessageCircle
                          className={`w-5 h-5 text-[var(--color-primary)] transition-transform ${
                            expandedFaq === index ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4"
                        >
                          <p className="text-[var(--color-text-light)] text-sm">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="h-80 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-2" />
                <p className="text-[var(--color-text-light)]">
                  Interactive Map Coming Soon
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
