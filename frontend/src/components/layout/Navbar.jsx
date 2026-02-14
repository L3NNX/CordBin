import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HardDrive, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { API_CONFIG } from '../../config/api';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const Navbar = () => {
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
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-accent shadow-accent-sm">
              <HardDrive className="h-4 w-4 text-accent-foreground" />
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
            {!user ? (
              <>
                <button
                  onClick={handleAuth}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-foreground
                    transition-colors duration-150 hover:bg-accent/5"
                  data-testid="login-btn"
                >
                  Sign In
                </button>
                <button
                  onClick={handleAuth}
                  className="group flex items-center gap-2 rounded-xl gradient-accent
                    px-5 py-2 text-sm font-medium text-accent-foreground shadow-sm
                    transition-all duration-200
                    hover:-translate-y-0.5 hover:shadow-accent-sm
                    active:scale-[0.98]"
                  data-testid="get-started-nav-btn"
                >
                  Get Started
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </button>
              </>
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
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;