import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Lock, Globe, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative w-full overflow-hidden pt-36 pb-28 md:pt-44 md:pb-32"
      data-testid="hero-section"
    >
      {/* ── Ambient background glow ── */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px]"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--accent) / 0.06), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container relative mx-auto flex max-w-6xl flex-col items-center px-6 text-center">

        <div
          className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-5 py-2 shadow-xs md:mb-12"
          data-testid="hero-badge"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse-dot" />
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
            Trusted by 50,000+ users worldwide
          </span>
        </div>


        <h1
          className="mb-8 max-w-4xl font-display text-[2.75rem] leading-[1.05] tracking-tight text-foreground sm:text-6xl md:mb-10 md:text-[5.25rem]"
          data-testid="hero-title"
        >
          Secure File Storage &{' '}
          <span className="gradient-text">Sharing Made Simple</span>
        </h1>

  
        <p
          className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:mb-14 md:text-xl"
          data-testid="hero-description"
        >
          Store, organize, and share your files securely in the cloud. Access
          your content from anywhere, collaborate with your team, and never lose
          important files again.
        </p>

        <div className="mb-6 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:w-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="group flex w-full items-center justify-center gap-3 rounded-xl
              gradient-accent px-8 py-3.5 text-base font-medium text-accent-foreground
              shadow-sm transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-accent-sm hover:brightness-110
              active:scale-[0.98]
              sm:w-auto"
            data-testid="hero-cta-primary"
          >
            Get Started Free
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>

          <button
            onClick={() =>
              document
                .getElementById('features')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="w-full rounded-xl border border-border bg-card px-8 py-3.5
              text-base font-medium text-foreground shadow-sm
              transition-all duration-200
              hover:border-accent/30 hover:bg-accent/5
              active:scale-[0.98]
              sm:w-auto"
            data-testid="hero-cta-secondary"
          >
            Learn More
          </button>
        </div>

        <p
          className="mb-24 text-sm text-muted-foreground/60 md:mb-28"
          data-testid="hero-note"
        >
          No credit card required · Free forever plan · Cancel anytime
        </p>

        {/* 
            Dashboard Mockup
            
      */}
        <div className="relative w-full">
          {/* Ambient glow behind mockup */}
          <div
            className="pointer-events-none absolute -inset-10 rounded-full opacity-50 blur-[120px]"
            style={{
              background: 'radial-gradient(ellipse at center, hsl(var(--accent) / 0.12), transparent 70%)',
            }}
            aria-hidden="true"
          />

          {/* Main mockup card */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl md:rounded-[2.5rem]">
            {/* ── Window chrome bar ── */}
            <div className="flex h-14 items-center justify-between border-b border-border/60 bg-muted/50 px-6 md:h-16 md:px-8">
              {/* Traffic lights */}
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-border" />
                <div className="h-3 w-3 rounded-full bg-border" />
                <div className="h-3 w-3 rounded-full bg-border" />
              </div>

              {/* Center icon + URL bar */}
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                  <Zap size={14} className="text-accent" />
                </div>
                <div className="hidden h-2 w-32 rounded-full bg-border sm:block" />
              </div>

              {/* Right icon */}
              <div className="h-8 w-8 rounded-lg bg-foreground" />
            </div>

            {/* ── Dashboard body ── */}
            <div className="grid grid-cols-12" style={{ minHeight: '420px' }}>
              {/* Sidebar mock — hidden on mobile */}
              <div className="col-span-3 hidden border-r border-border/60 p-6 text-left md:block lg:p-8">
                <div className="space-y-8">
                  {/* Nav section */}
                  <div className="space-y-3">
                    <div className="h-2 w-12 rounded-full bg-border" />
                    <div className="space-y-2">
                      <div className="h-8 w-full rounded-xl border border-accent/20 bg-accent/5" />
                      <div className="h-8 w-full rounded-xl bg-muted" />
                      <div className="h-8 w-full rounded-xl bg-muted" />
                    </div>
                  </div>
                  {/* Tags section */}
                  <div className="space-y-3">
                    <div className="h-2 w-16 rounded-full bg-border" />
                    <div className="flex flex-wrap gap-2">
                      <div className="h-6 w-14 rounded-full border border-accent/20 bg-accent/5" />
                      <div className="h-6 w-10 rounded-full border border-border bg-muted" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content area */}
              <div className="col-span-12 bg-card p-6 text-left md:col-span-9 md:p-10 lg:p-12">
                {/* Content header */}
                <div className="mb-10 flex items-end justify-between md:mb-12">
                  <div>
                    <h4 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                      My Files
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Last updated 2 mins ago
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors duration-150 hover:border-accent/30 hover:text-foreground">
                      <Globe size={18} />
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors duration-150 hover:border-accent/30 hover:text-foreground">
                      <Lock size={18} />
                    </div>
                  </div>
                </div>

                {/* File cards grid */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-muted/50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-md lg:rounded-3xl lg:p-6"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card shadow-xs lg:h-14 lg:w-14 lg:rounded-2xl">
                        {i % 2 === 0 ? (
                          <ShieldCheck
                            className="text-accent transition-transform duration-200 group-hover:scale-110"
                            size={22}
                          />
                        ) : (
                          <Zap
                            className="text-accent transition-transform duration-200 group-hover:scale-110"
                            size={22}
                          />
                        )}
                      </div>
                      <div className="h-2 w-20 rounded-full bg-border" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

   
          <div
            className={cn(
              "absolute -bottom-4 right-4 z-10 flex max-w-[280px] items-center gap-4 rounded-2xl p-5 text-left shadow-xl",
              "bg-foreground text-background",
              "md:-bottom-8 md:right-10 md:rounded-3xl md:p-6"
            )}
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-accent shadow-accent-sm">
              <Lock size={18} className="text-accent-foreground" />
            </div>
            <div>
              <p className="mb-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                Status: Secured
              </p>
              <p className="text-sm font-medium leading-tight text-background/90">
                256-bit Encryption Active.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;