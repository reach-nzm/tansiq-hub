'use client';

import HeroSection from '@/components/home/HeroSectionNew';
import CategoriesSection from '@/components/home/CategoriesSectionNew';
import FeaturedProducts from '@/components/home/FeaturedProductsNew';
import PromoBanner from '@/components/home/PromoBannerNew';
import FeaturesSection from '@/components/home/FeaturesSectionNew';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <PromoBanner />
      <FeaturesSection />
    </>
  );
}
