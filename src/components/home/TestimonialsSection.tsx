'use client';

import { motion } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Ahmad Hassan',
    location: 'Dubai, UAE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
    text: 'Tansiq Hub has become my go-to store for all Islamic products. The quality is exceptional, and the service is always excellent. May Allah bless this business!',
    product: 'Premium Medjool Dates',
  },
  {
    id: 2,
    name: 'Fatima Ali',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    text: 'I love the hijab collection! The fabrics are high quality and the colors are beautiful. The delivery was fast and the packaging was lovely.',
    product: 'Chiffon Hijab Collection',
  },
  {
    id: 3,
    name: 'Omar Khan',
    location: 'Toronto, Canada',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    rating: 5,
    text: 'The Islamic books selection is amazing. Found rare titles that I could not find anywhere else. JazakAllah khair for this wonderful service!',
    product: 'Riyad as-Salihin',
  },
  {
    id: 4,
    name: 'Aisha Rahman',
    location: 'Riyadh, KSA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    rating: 5,
    text: 'The organic honey is absolutely divine! Pure and authentic, just as described. Will definitely be ordering more. Highly recommended!',
    product: 'Sidr Honey',
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-[var(--color-primary)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[var(--color-secondary)] font-medium tracking-wider uppercase text-sm">
            What Our Customers Say
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
            Blessed Reviews
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Hear from our satisfied customers about their experience with Tansiq Hub.
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="relative">
          {/* Main Testimonial */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 relative">
              {/* Quote Icon */}
              <div className="absolute -top-6 left-10">
                <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex items-center justify-center">
                  <Quote className="w-6 h-6 text-[var(--color-primary-dark)]" />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--color-secondary)]">
                    <img
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 text-center md:text-left">
                  {/* Rating */}
                  <div className="flex justify-center md:justify-start gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[var(--color-secondary)] fill-[var(--color-secondary)]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-lg text-[var(--color-text)] mb-6 leading-relaxed">
                    "{testimonials[currentIndex].text}"
                  </p>

                  {/* Author */}
                  <div>
                    <h4 className="font-bold text-[var(--color-primary)]">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-sm text-[var(--color-text-light)]">
                      {testimonials[currentIndex].location}
                    </p>
                    <p className="text-sm text-[var(--color-secondary)] mt-1">
                      Purchased: {testimonials[currentIndex].product}
                    </p>
                  </div>
                </div>
              </div>

              {/* Islamic Pattern Corner */}
              <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5">
                <svg viewBox="0 0 100 100">
                  <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M10 0l10 10-10 10L0 10z" fill="currentColor" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#pattern)" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-[var(--color-secondary)] w-8'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
