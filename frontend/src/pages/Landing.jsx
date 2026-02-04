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

const Landing = () => {
  // const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      
      {/* How It Works Section */}
      <section className="py-32 bg-white" data-testid="how-it-works-section">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
              How It Works
            </div>
            <h2 className="text-4xl md:text-6xl font-[900] tracking-tighter text-slate-900 mb-6" data-testid="how-it-works-title">
              Get started in three simple steps
            </h2>
            <p className="text-lg text-slate-500 font-medium" data-testid="how-it-works-description">
              Simple, fast, and secure file management
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                number: "01",
                title: "Upload Your Files",
                description: "Drag and drop your files or select them from your device. We support all file types.",
              },
              {
                number: "02",
                title: "Organize & Manage",
                description: "Create folders, tag files, and organize your content exactly how you want it.",
              },
              {
                number: "03",
                title: "Share & Collaborate",
                description: "Generate secure links and share with anyone. Control who can access your files.",
              },
            ].map((step, index) => (
              <div key={index} className="relative text-center" data-testid={`step-${index}`}>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 font-black text-2xl mb-8">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[65%] w-[70%] h-0.5 bg-slate-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />

      {/* Testimonials Section */}
      <section className="py-32 bg-white" data-testid="testimonials-section">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
              Testimonials
            </div>
            <h2 className="text-4xl md:text-6xl font-[900] tracking-tighter text-slate-900 mb-6" data-testid="testimonials-title">
              Loved by users worldwide
            </h2>
            <p className="text-lg text-slate-500 font-medium" data-testid="testimonials-description">
              See what our customers have to say
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Director",
                company: "TechCorp",
                content: "FileVault Pro has transformed how our team shares and manages files. The interface is intuitive and the sharing features are exactly what we needed.",
              },
              {
                name: "Michael Chen",
                role: "Freelance Designer",
                company: "Independent",
                content: "I've tried many file storage solutions, but FileVault Pro is by far the best. Fast, secure, and incredibly easy to use. Highly recommended!",
              },
              {
                name: "Emily Rodriguez",
                role: "Project Manager",
                company: "Creative Studio",
                content: "The collaboration features are outstanding. Our team can now work together seamlessly, and the security features give us peace of mind.",
              },
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100"
                data-testid={`testimonial-card-${index}`}
              >
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-8">{testimonial.content}</p>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ />

      

      <Footer />
    </div>
  );
};

export default Landing;