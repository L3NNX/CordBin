import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const steps = [
  {
    number: "01",
    title: "Upload Your Files",
    description:
      "Drag and drop your files or select them from your device. We support all file types.",
  },
  {
    number: "02",
    title: "Organize & Manage",
    description:
      "Create folders, tag files, and organize your content exactly how you want it.",
  },
  {
    number: "03",
    title: "Share & Collaborate",
    description:
      "Generate secure links and share with anyone. Control who can access your files.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-28 md:py-36" data-testid="how-it-works-section">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-5 py-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
              How It Works
            </span>
          </div>

          <h2
            className="font-display text-3xl tracking-tight text-foreground sm:text-4xl md:text-[3.25rem] md:leading-[1.15]"
            data-testid="how-it-works-title"
          >
            Get started in{' '}
            <span className="gradient-text">three simple steps</span>
          </h2>

          <p className="mt-5 text-base text-muted-foreground sm:text-lg" data-testid="how-it-works-description">
            Simple, fast, and secure file management
          </p>
        </div>

        {/* Steps */}
        <div className="relative mx-auto max-w-5xl">
          {/* Connecting line — visible on desktop only */}
          <div className="pointer-events-none absolute top-12 left-[16.66%] right-[16.66%] hidden h-[2px] md:block">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20" />
          </div>

          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center text-center"
                data-testid={`step-${index}`}
              >
                {/* Step number */}
                <div className="relative mb-7">
                  <div className="grid h-20 w-20 place-items-center rounded-2xl border border-accent/20 bg-card font-mono text-2xl font-semibold text-accent shadow-sm transition-all duration-300 hover:shadow-accent-sm hover:-translate-y-0.5">
                    {step.number}
                  </div>

                  {/* Arrow connector between steps — desktop only */}
                  {index < steps.length - 1 && (
                    <div className="absolute -right-4/2 top-1/2 hidden -translate-y-1/4 md:block">
                      <div className="grid h-7 w-7 place-items-center rounded-full gradient-accent shadow-accent-sm">
                        <ArrowRight size={14} className="text-accent-foreground" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="mb-3 text-lg font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="max-w-[280px] text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;