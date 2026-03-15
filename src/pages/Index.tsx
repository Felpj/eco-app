import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import FeaturedProduct from "@/components/FeaturedProduct";
import PhilosophySection from "@/components/PhilosophySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BenefitsSection />
      <FeaturedProduct />
      <PhilosophySection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Index;
