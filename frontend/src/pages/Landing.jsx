// pages/Landing.tsx
import React, { useEffect } from 'react';
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
import { useAuth } from '../hooks/useAuth';

const Landing = () => {
    const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <Hero />
      
      <Features />

      <HowItWorks />  

      <Pricing />

      <Testimonials />

      <FAQ />

      <Footer />
    </div>
  );
};

export default Landing;