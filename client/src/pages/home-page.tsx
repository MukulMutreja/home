import MainNav from "@/components/layout/main-nav";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import PopularServices from "@/components/home/popular-services";
import WhyChooseUs from "@/components/home/why-choose-us";
import TopProviders from "@/components/home/top-providers";
import HowItWorks from "@/components/home/how-it-works";
import Testimonials from "@/components/home/testimonials";
import AppDownload from "@/components/home/app-download";
import JoinAsPro from "@/components/home/join-as-pro";
import Newsletter from "@/components/home/newsletter";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-grow">
        <HeroSection />
        <PopularServices />
        <WhyChooseUs />
        <TopProviders />
        <HowItWorks />
        <Testimonials />
        <AppDownload />
        <JoinAsPro />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
