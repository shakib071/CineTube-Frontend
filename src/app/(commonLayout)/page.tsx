import EditorPicksSection from "@/components/modules/home/EditorPicksSection";
import Footer from "@/components/modules/home/Footer";
import HeroSection from "@/components/modules/home/HeroSection";
import NewlyAddedSection from "@/components/modules/home/NewlyAddedSection";
import NewsletterSection from "@/components/modules/home/NewsletterSection";
import PricingSection from "@/components/modules/home/PricingSection";
import TopRatedSection from "@/components/modules/home/TopRatedSection";


export const metadata = {
  title: "CineTube — Your Streaming Universe",
  description: "Discover, rate, and stream the best movies and series.",
};

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <div className="container mx-auto px-4 py-12 space-y-16">
        <TopRatedSection />
        <NewlyAddedSection />
        <EditorPicksSection />
        <PricingSection />
        <NewsletterSection />
      </div>

      <Footer />
    </div>
  );
}
