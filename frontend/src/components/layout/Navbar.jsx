import React from "react";
import { API_CONFIG } from "../../config/api";
import { Button } from "../ui/button";
const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Benefits", href: "#benefits" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQs", href: "#faqs" },
];

const Navbar = () => {
  const handleAuth = () => {
    window.location.href =
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_GOOGLE_REDIRECT}`;
  };

  return (
    <header className="w-full px-3 pt-3 sm:px-6 lg:px-8 font-mono">
      <div className="mx-auto w-full max-w-[1720px] border border-border bg-background">

        <div className="relative">

          {/* Corner brackets */}
          <span className="pointer-events-none absolute inset-0 z-20">
            <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-foreground/40" />
            <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-foreground/40" />
            <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-foreground/40" />
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-foreground/40" />
          </span>

          <div className="flex min-h-[52px] items-center justify-between px-5 py-3 sm:px-8 lg:px-10">

            <a href="/" className="inline-flex items-center">
              <img src="/favicon.svg" className="h-8 w-8" />
            </a>

            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-sm text-foreground/70 transition-colors hover:text-foreground
                  after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-foreground
                  after:transition-all after:duration-200 hover:after:w-full"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">


              <Button variant="corner" onClick={handleAuth}>
                Contact us
              </Button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;