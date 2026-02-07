import React from 'react';
import { HardDrive } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background" data-testid="footer">
      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        {/* Footer Content Grid */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] rounded-xl flex items-center justify-center shadow-lg shadow-[#0052FF]/20">
                <HardDrive className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">StashBox</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Secure file storage and sharing for everyone. Built with privacy and simplicity in mind.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-6 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-[#0052FF] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#0052FF] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#0052FF] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0052FF] transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-6 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-[#0052FF] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0052FF] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0052FF] transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0052FF] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-6 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-[#0052FF] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0052FF] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0052FF] transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Divider & Copyright */}
        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 StashBox. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;