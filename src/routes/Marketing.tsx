import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Marketing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main role="main">
        <HeroSection />
        <FeatureSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Marketing;