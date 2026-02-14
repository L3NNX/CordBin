import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const plans = [
  {
    name: "Starter",
    price: "0",
    desc: "Perfect for casual storage",
    features: [
      "10GB Encrypted Storage",
      "Basic Share Links",
      "Mobile Access",
      "Standard Support",
    ],
    cta: "Join Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "12",
    desc: "The professional's choice",
    features: [
      "1TB Fast Storage",
      "Semantic AI Search",
      "Password Protection",
      "Priority Syncing",
      "Version History",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Team",
    price: "49",
    desc: "Built for scaling teams",
    features: [
      "Unlimited Storage",
      "Custom Domain Links",
      "SSO/SAML Login",
      "Admin Dashboard",
      "Audit Logs",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const getPrice = (base) => {
    const num = parseInt(base);
    return isYearly ? Math.floor(num * 0.8) : num;
  };

  return (
    <section id="pricing" className="py-28 md:py-36" data-testid="pricing-section">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-5 py-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
              Pricing
            </span>
          </div>

          <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl md:text-[3.25rem] md:leading-[1.15]">
            Simple, honest{' '}
            <span className="gradient-text">pricing</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Choose a plan that scales with your growth. No hidden fees, no complexity.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mb-14 flex items-center justify-center gap-4 md:mb-16">
          <span
            className={cn(
              "text-sm font-medium transition-colors duration-150",
              !isYearly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </span>

          <button
            onClick={() => setIsYearly(!isYearly)}
            className={cn(
              "relative flex h-7 w-12 items-center rounded-full p-1 transition-colors duration-200",
              isYearly ? "gradient-accent" : "bg-border"
            )}
            aria-label={isYearly ? "Switch to monthly" : "Switch to yearly"}
          >
            <div
              className={cn(
                "h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                isYearly ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>

          <span
            className={cn(
              "text-sm font-medium transition-colors duration-150",
              isYearly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Yearly
            <span className="ml-1.5 font-mono text-[11px] text-accent">-20%</span>
          </span>
        </div>

        {/* Cards */}
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={cn(
                "relative rounded-2xl text-left transition-all duration-300",
                plan.featured
                  ? "lg:-translate-y-4"
                  : "hover:-translate-y-1"
              )}
              data-testid={`pricing-card-${i}`}
            >
              {/* Gradient border for featured */}
              {plan.featured && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent via-accent-secondary to-accent p-[1.5px]">
                  <div className="h-full w-full rounded-[calc(1rem-1.5px)] bg-card" />
                </div>
              )}

              <div
                className={cn(
                  "relative rounded-2xl p-8 sm:p-10",
                  plan.featured
                    ? "shadow-xl"
                    : "border border-border bg-card hover:border-accent/20 hover:shadow-lg"
                )}
              >
                {/* Popular badge */}
                {plan.featured && (
                  <div className="absolute -top-3.5 right-8 rounded-full gradient-accent px-4 py-1.5 shadow-accent-sm">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-foreground">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan name & desc */}
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>

                {/* Price */}
                <div className="mt-7 flex items-baseline gap-1.5">
                  <span className="font-display text-5xl text-foreground">
                    ${getPrice(plan.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>

                {/* CTA */}
                <button
                  className={cn(
                    "mt-8 w-full rounded-xl py-3.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                    plan.featured
                      ? "gradient-accent text-accent-foreground shadow-sm hover:-translate-y-0.5 hover:shadow-accent-sm hover:brightness-110"
                      : "border border-border bg-card text-foreground hover:border-accent/30 hover:bg-accent/5"
                  )}
                >
                  {plan.cta}
                </button>

                {/* Features */}
                <ul className="mt-8 space-y-3.5">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div
                        className={cn(
                          "grid h-5 w-5 shrink-0 place-items-center rounded-full",
                          plan.featured
                            ? "gradient-accent"
                            : "bg-accent/10"
                        )}
                      >
                        <Check
                          size={11}
                          strokeWidth={3}
                          className={plan.featured ? "text-accent-foreground" : "text-accent"}
                        />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;