import React, { useState } from "react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 0,
    desc: "Perfect for casual storage.",
    features: [
      "10GB Encrypted Storage",
      "Basic Share Links",
      "Mobile Access",
      "Standard Support",
    ],
  },
  {
    name: "Pro",
    price: 12,
    desc: "The professional's choice.",
    features: [
      "1TB Fast Storage",
      "Semantic AI Search",
      "Password Protection",
      "Priority Syncing",
      "Version History",
    ],
    popular: true,
  },
  {
    name: "Team",
    price: 49,
    desc: "Built for scaling teams.",
    features: [
      "Unlimited Storage",
      "Custom Domain Links",
      "SSO/SAML Login",
      "Admin Dashboard",
      "Audit Logs",
    ],
  },
];

const Pricing = () => {
  const [yearly, setYearly] = useState(false);

    const getPrice = (price) =>
    yearly ? Math.floor(price * 0.8) : price;

  return (
    <section id="pricing" className="w-full bg-[#f3f3f2]">

      <div className="relative border border-border bg-[#f3f3f2] px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">

        {/* Corner brackets */}
        <span className="pointer-events-none absolute inset-0 z-10">
          <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-black/30" />
          <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-black/30" />
          <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-black/30" />
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-black/30" />
        </span>

        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-black/50">
          <span className="h-3.5 w-[4px] bg-black/40"></span>
          <span>Pricing</span>
        </div>

        {/* Heading */}
        <h2 className="max-w-[740px] text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] leading-[0.95] tracking-[-0.04em] text-black/90">
          Simple licensing for
          <br className="hidden sm:block" />
          production teams
        </h2>

        {/* Billing Toggle */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="font-mono text-sm text-black/90">Monthly</span>

          <button
            onClick={() => setYearly(!yearly)}
            className="relative h-6 w-11 border border-black/15 bg-black/8"
          >
            <span
              className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 border border-black/10 bg-white transition-all duration-200 ${
                yearly ? "left-[22px]" : "left-[3px]"
              }`}
            />
          </button>

          <span className="font-mono text-sm text-black/40">
            Yearly
          </span>
        </div>

        {/* Plans Grid */}
        <div className="mt-8 grid gap-3 xl:grid-cols-3">

          {plans.map((plan, i) => (
            <article
              key={i}
              className="relative border border-black/12 bg-[#f6f6f5] px-5 py-6 sm:px-6 sm:py-7"
            >

              {/* Card corner brackets */}
              <span className="pointer-events-none absolute inset-0 z-10">
                <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-black/30" />
                <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-black/30" />
                <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-black/30" />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-black/30" />
              </span>

              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-medium tracking-[-0.03em] text-black/90">
                  {plan.name}
                </h3>

                {plan.popular && (
                  <span className="border border-black/12 bg-[#efefee] px-2.5 py-1 font-mono text-xs text-black/80">
                    Popular
                  </span>
                )}
              </div>

              <p className="mt-3 min-h-[48px] max-w-[290px] text-sm text-black/60">
                {plan.desc}
              </p>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl tracking-[-0.05em] text-black/90">
                  ${getPrice(plan.price)}
                </span>
                <span className="pb-1 font-mono text-sm text-black/50">
                  /month
                </span>
              </div>

              <button
                className={`relative mt-4 flex h-11 w-full items-center justify-center border font-mono text-sm tracking-wide transition-colors ${
                  plan.popular
                    ? "border-black bg-black text-white hover:bg-neutral-800"
                    : "border-black/15 bg-[#f8f8f7] text-black/85 hover:bg-black/5"
                }`}
              >
                Get Started

                <span className="pointer-events-none absolute inset-0">
                  <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-black/20" />
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-black/20" />
                  <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-black/20" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-black/20" />
                </span>
              </button>

              <div className="mt-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-black/10"></span>
                <span className="font-mono text-xs text-black/40">
                  What you get
                </span>
                <span className="h-px flex-1 bg-black/10"></span>
              </div>

              <ul className="mt-4 space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/10">
                      <Check className="size-3 text-black/65" />
                    </span>
                    <span className="text-sm text-black/65">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

            </article>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Pricing;