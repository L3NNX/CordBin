import React from 'react';
import { HardDrive } from 'lucide-react';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Security', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-card" data-testid="footer">
      <div className="container mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mb-12 grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="/" className="mb-6 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-accent shadow-accent-sm">
                <HardDrive className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="font-display text-lg text-foreground">StashBox</span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Secure file storage and sharing for everyone. Built with privacy and simplicity in mind.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/50">
                {group.title}
              </h3>
              <ul className="space-y-3.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-150 hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/60 pt-8 text-center">
          <p className="text-sm text-muted-foreground/60">
            © {new Date().getFullYear()} StashBox. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;