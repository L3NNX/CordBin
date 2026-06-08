import React from "react";
import { ShieldCheck, Code, Activity, SquareCheckBig } from "lucide-react";
import { Button } from "../ui/button";

const featureList = [
  {
    icon: ShieldCheck,
    title: "Automated Pre-Deploy Validation",
    description:
      "Every deployment is checked for configuration, licenses, and quality issues before it goes live.",
  },
  {
    icon: Code,
    title: "Code & Test Signals",
    description:
      "Surface test failures, warnings, and code quality signals in one clear execution log.",
  },
  {
    icon: Activity,
    title: "Real-Time Execution Feedback",
    description:
      "Get instant feedback on your pipeline execution with real-time logs and status updates.",
  },
  {
    icon: SquareCheckBig,
    title: "Actionable Validation Results",
    description:
      "Clear, actionable results that help your team fix issues fast and ship with confidence.",
    active: true,
  },
];

const Features = () => {
  return (
    <div className="relative border border-border bg-[#f5f5f5] p-6 sm:p-8 lg:p-10">

      {/* Corner brackets */}
      <span className="pointer-events-none absolute inset-0 z-10">
        <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-foreground/40" />
        <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-foreground/40" />
        <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-foreground/40" />
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-foreground/40" />
      </span>

      {/* Top grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">

        <div>
          <div className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-foreground/50">
            <span className="h-3.5 w-[4px] bg-foreground/40"></span>
            <span>Features</span>
          </div>

          <h2 className="max-w-[700px] text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] leading-[0.95] tracking-[-0.04em]">
            Catch issues before they
            <br className="hidden sm:block" />
            reach production
          </h2>
        </div>

        <div className="lg:pt-14">
          <p className="max-w-[320px] text-base sm:text-lg leading-relaxed text-foreground/60">
            Every deployment is automatically checked for critical quality issues before it goes live.
          </p>

      <Button variant="corner">
  Contact us
</Button>
        </div>
      </div>

      {/* Feature + Image grid */}
      <div className="mt-10 grid gap-3 lg:grid-cols-[1fr_1.5fr] lg:items-stretch">

        {/* LEFT */}
        <div className="flex h-full flex-col gap-3">

          {featureList.map((feature, i) => (
            <div key={i} className="flex-1">
              <article
                className={`relative h-full border bg-white px-6 py-7 sm:px-8 overflow-hidden ${
                  feature.active
                    ? "border-black/20"
                    : "border-black/10 hover:border-black/15"
                }`}
              >
                <span className="pointer-events-none absolute inset-0 z-10">
                  <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-foreground/40" />
                  <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-foreground/40" />
                  <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-foreground/40" />
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-foreground/40" />
                </span>

                <div className="flex items-start gap-4">
                  <feature.icon className="mt-1 size-5 shrink-0 text-black/40" />
                  <div className="flex-1">
                    <h3
                      className={`text-base sm:text-lg font-medium leading-snug ${
                        feature.active ? "text-black" : "text-black/50"
                      }`}
                    >
                      {feature.title}
                    </h3>

                    {feature.active && (
                      <p className="mt-2 text-sm sm:text-base leading-relaxed text-black/55">
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>

                {feature.active && (
                  <div className="absolute bottom-0 left-0 h-[3px] w-full bg-black/5">
                    <div className="h-full bg-black w-[80%]" />
                  </div>
                )}
              </article>
            </div>
          ))}
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative border border-border p-1">
          <div className="relative min-h-[380px] sm:min-h-[480px] overflow-hidden">

            <img
              src="https://dummyimage.com/1200x900/999999/000000"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute border border-black/20 bg-black left-4 top-4 right-0 bottom-4 sm:left-6 sm:top-6 sm:bottom-6 lg:left-8 lg:top-8 lg:bottom-8">
              <img
                src="https://dummyimage.com/1200x800/111111/ffffff"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Features;