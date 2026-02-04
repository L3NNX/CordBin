// components/Footer.tsx
import React from 'react';
import { Cloud } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 py-16 bg-white" data-testid="footer">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Cloud className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">Vaultly</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Secure file storage and sharing for everyone. Built with privacy in mind.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">Security</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-8 text-center">
          <p className="text-sm text-slate-400">
            © 2025 Vaultly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;