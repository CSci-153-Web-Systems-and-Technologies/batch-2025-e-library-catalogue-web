import React from "react";
import LandingNavBar from "./LandingNavBar";
import HeroSection from "./HeroSection";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <LandingNavBar />
      <HeroSection />
    </div>
  );
};

export default LandingPage;