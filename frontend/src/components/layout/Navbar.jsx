// components/Navbar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3" data-testid="logo">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Cloud className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">Vaultly</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              FAQ
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-bold text-slate-900 px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
              data-testid="login-btn"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-bold text-white bg-slate-900 px-6 py-2.5 rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
              data-testid="get-started-nav-btn"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;