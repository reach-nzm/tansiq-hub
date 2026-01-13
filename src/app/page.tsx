'use client';

import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import PromoSection from '@/components/home/PromoSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <PromoSection />
      <FeaturesSection />
      <TestimonialsSection />
    </>
  );
}
