import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { API_CONFIG } from '../../config/api';
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) return null;

  const handleAuth = () => {
    window.location.href = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_GOOGLE_REDIRECT}`;
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between md:h-18">
          {/* Brand */}
          <a href="/" className="flex items-center gap-3" data-testid="logo">
            <div className="h-9 w-9">
              <img
                src="/favicon.svg"
                alt="StashBox Logo"
                className="h-full w-full"
              />
            </div>
            <span className="font-display text-lg text-foreground">
              StashBox
            </span>
          </a>

          {/* Nav links — desktop */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="grid h-9 w-9 place-items-center rounded-xl border border-border/60
      text-muted-foreground transition-all duration-150
      hover:bg-accent/5 hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {!user ? (
              <button
                onClick={handleAuth}
                className="group flex items-center gap-2 rounded-xl gradient-accent
        px-5 py-2 text-sm font-medium text-accent-foreground shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-accent-sm
        active:scale-[0.98]"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="group flex items-center gap-2 rounded-xl gradient-accent
        px-5 py-2 text-sm font-medium text-accent-foreground shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-accent-sm
        active:scale-[0.98]"
              >
                Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;