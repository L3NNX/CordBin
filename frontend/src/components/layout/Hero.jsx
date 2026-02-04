// components/Hero.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Lock, Globe, Zap } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-44 pb-32 w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center" data-testid="hero-section">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-12 shadow-sm" data-testid="hero-badge">
        <ShieldCheck size={14} className="text-emerald-500" />
        Trusted by 50,000+ users worldwide
      </div>
      
      <h1 className="text-5xl md:text-8xl font-[900] tracking-tighter text-slate-900 leading-[0.9] mb-10 max-w-4xl" data-testid="hero-title">
        Secure File Storage &{' '}
        <span className="text-indigo-600">Sharing Made Simple</span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-14 leading-relaxed font-medium" data-testid="hero-description">
        Store, organize, and share your files securely in the cloud. Access your content from anywhere, collaborate with your team, and never lose important files again.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 w-full">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full sm:w-auto bg-slate-900 text-white text-lg font-bold px-10 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 hover:translate-y-[-2px] active:scale-95"
          data-testid="hero-cta-primary"
        >
          Get Started Free
          <ArrowRight size={20} />
        </button>
        <button 
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full sm:w-auto bg-white text-slate-900 text-lg font-bold px-10 py-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95"
          data-testid="hero-cta-secondary"
        >
          Learn More
        </button>
      </div>

      <p className="text-sm text-slate-400 font-medium mb-32" data-testid="hero-note">
        No credit card required • Free forever plan • Cancel anytime
      </p>

      {/* Dashboard Mockup */}
      <div className="relative w-full group">
        <div className="absolute -inset-10 bg-indigo-500/10 blur-[120px] rounded-full opacity-60"></div>
        
        <div className="relative bg-white border border-slate-200 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden">
          <div className="h-16 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between px-8">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            </div>
            <div className="flex items-center gap-4">
               <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                 <Zap size={14} className="text-indigo-600" />
               </div>
               <div className="h-2 w-32 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-8 w-8 bg-slate-900 rounded-lg"></div>
          </div>

          <div className="grid grid-cols-12 h-[500px]">
            <div className="col-span-3 border-r border-slate-100 p-8 hidden md:block text-left">
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-indigo-50 border border-indigo-100 rounded-xl w-full"></div>
                    <div className="h-8 bg-slate-50 rounded-xl w-full"></div>
                    <div className="h-8 bg-slate-50 rounded-xl w-full"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-14 bg-emerald-50 rounded-full border border-emerald-100"></div>
                    <div className="h-6 w-10 bg-purple-50 rounded-full border border-purple-100"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-9 p-8 md:p-12 bg-white text-left">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h4 className="text-2xl font-black tracking-tight text-slate-900">My Files</h4>
                  <p className="text-sm text-slate-400 font-medium">Last updated 2 mins ago</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">
                    <Globe size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">
                    <Lock size={18} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center gap-4 transition-transform hover:scale-105 cursor-pointer">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                       {i % 2 === 0 ? <ShieldCheck className="text-emerald-500" size={24} /> : <Zap className="text-indigo-600" size={24} />}
                    </div>
                    <div className="h-2 w-20 bg-slate-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-6 -right-6 md:right-10 md:-bottom-10 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl flex items-center gap-4 max-w-[280px] text-left">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
            <Lock size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Status: Secured</p>
            <p className="text-sm font-medium leading-tight">256-bit Encryption Active.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;