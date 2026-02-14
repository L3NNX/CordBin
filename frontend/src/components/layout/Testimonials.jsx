import React from 'react';
import { cn } from '../../lib/utils';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    content:
      "StashBox has transformed how our team shares and manages files. The interface is intuitive and the sharing features are exactly what we needed.",
  },
  {
    name: "Michael Chen",
    role: "Freelance Designer",
    company: "Independent",
    content:
      "I've tried many file storage solutions, but StashBox is by far the best. Fast, secure, and incredibly easy to use. Highly recommended!",
    featured: true,
  },
  {
    name: "Emily Rodriguez",
    role: "Project Manager",
    company: "Creative Studio",
    content:
      "The collaboration features are outstanding. Our team can now work together seamlessly, and the security features give us peace of mind.",
  },
];

const StarIcon = () => (
  <svg className="h-4 w-4 fill-current text-amber-400" viewBox="0 0 20 20">
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-28 md:py-36" data-testid="testimonials-section">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-5 py-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
              Testimonials
            </span>
          </div>

          <h2
            className="font-display text-3xl tracking-tight text-foreground sm:text-4xl md:text-[3.25rem] md:leading-[1.15]"
            data-testid="testimonials-title"
          >
            Loved by users{' '}
            <span className="gradient-text">worldwide</span>
          </h2>

          <p className="mt-5 text-base text-muted-foreground sm:text-lg" data-testid="testimonials-description">
            See what our customers have to say
          </p>
        </div>

        {/* Cards grid — center card offset vertically on desktop */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={cn(
                "group relative rounded-2xl border p-7 transition-all duration-300 sm:p-8",
                testimonial.featured
                  ? "border-transparent md:translate-y-[-1rem]"
                  : "border-border bg-card hover:border-accent/20 hover:shadow-lg"
              )}
              data-testid={`testimonial-card-${index}`}
            >
              {/* Gradient border wrap for featured card */}
              {testimonial.featured && (
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent via-accent-secondary to-accent p-[1.5px]">
                  <div className="h-full w-full rounded-[calc(1rem-1.5px)] bg-card" />
                </div>
              )}

              <div className="relative">
                {/* Accent bar */}
                <div className="mb-6 h-1 w-10 rounded-full gradient-accent" />

                {/* Stars */}
                <div className="mb-5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} />
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-8 leading-relaxed text-muted-foreground">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/10 font-medium text-accent text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;