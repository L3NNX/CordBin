import React from 'react';
import { Upload, Share2, Shield, Folder, Zap, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

const features = [
  {
    icon: Upload,
    title: "Easy File Upload",
    description:
      "Drag and drop files or click to upload. Support for all file types with bulk upload capability.",
  },
  {
    icon: Share2,
    title: "Secure Sharing",
    description:
      "Share files with anyone using secure links. Control access and set expiration dates.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level encryption for your files. Your data is protected with industry-leading security.",
  },
  {
    icon: Folder,
    title: "Smart Organization",
    description:
      "Organize files into folders. Search and filter to find what you need instantly.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized for speed. Upload, download, and share files in seconds, not minutes.",
  },
  // {
  //   icon: Users,
  //   title: "Team Collaboration",
  //   description:
  //     "Work together seamlessly. Share folders with your team and collaborate in real-time.",
  // },
  
];

const Features = () => {
  return (
    <section id="features" className="py-28 bg-muted/50 md:py-36" data-testid="features-section">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-5 py-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
              Features
            </span>
          </div>

          <h2
            className="font-display text-3xl tracking-tight text-foreground sm:text-4xl md:text-[3.25rem] md:leading-[1.15]"
            data-testid="features-title"
          >
            Everything you need to{' '}
            <span className="gradient-text">manage your files</span>
          </h2>

          <p className="mt-5 text-base text-muted-foreground sm:text-lg" data-testid="features-description">
            Powerful features designed to make file management effortless
          </p>
        </div>

        {/* Grid — first card spans 2 cols on lg for asymmetry */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-300",
                "hover:-translate-y-1 hover:border-accent/20 hover:shadow-lg",
                index === 0 && "lg:col-span-2"
              )}
              data-testid={`feature-card-${index}`}
            >
              {/* Hover gradient overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 card-hover-gradient group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl gradient-accent shadow-accent-sm transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-5 w-5 text-accent-foreground" />
                </div>

                <h3 className="mb-2.5 text-lg font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;