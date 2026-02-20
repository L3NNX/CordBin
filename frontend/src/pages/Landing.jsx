// pages/Landing.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import Navbar from '../components/layout/Navbar';
import Hero from '../components/layout/Hero';
import Features from '../components/layout/Features';
import Pricing from '../components/layout/Pricing';
import FAQ from '../components/layout/FAQ';
import Footer from '../components/layout/Footer';
import Testimonials from '../components/layout/Testimonials';
import HowItWorks from '../components/layout/HowItWorks';

const Landing = () => {
  // const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />

      {/* How It Works Section */}
      <HowItWorks />  

      <Pricing />

      {/* Testimonials Section */}
      <Testimonials />

      <FAQ />



      <Footer />
    </div>
  );
};

export default Landing;