// components/layout/HowItWorks.tsx
import React from "react";
import w1 from "../../assets/w1.png";
import w2 from "../../assets/w2.png";
import w3 from "../../assets/w3.png";
const steps = [
  {
    stepLabel: "Step 1",
    title: "Encrypt & Chunk",
    description:
      "Objects are encrypted client-side using AES-256-GCM, then split into optimized chunks for resilient transfer.",
    bgImage: "https://dummyimage.com/1200x900/cfcfcf/000000",
    panelImage: w1,
  },
  {
    stepLabel: "Step 2",
    title: "Distributed Upload",
    description:
      "Chunks are distributed across multiple Discord channels with intelligent rate-limit handling to prevent API bans and maximize throughput.",
    bgImage: "https://dummyimage.com/1200x900/cfcfcf/000000",
    panelImage: w2,
  },
  {
    stepLabel: "Step 3",
    title: "Secure Retrieval",
    description:
      "Encrypted chunks are streamed and reassembled on demand, with token-based access control and on-the-fly decryption.",
    bgImage: "https://dummyimage.com/1200x900/cfcfcf/000000",
    panelImage: w3,
  },
];

const HowItWorks = () => {
  return (
    <div className="relative border border-black/12 bg-[#f3f3f2] px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
      {/* Panel corner brackets */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
        <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-black/30" />
        <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-black/30" />
        <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-black/30" />
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-black/30" />
      </span>

      <div className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-black/50">
        <span className="h-3.5 w-[4px] bg-black/40" />
        <span>How it works</span>
      </div>

      <h2 className="max-w-[700px] text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] leading-[0.95] tracking-[-0.04em] text-black/90">
        From upload to sharing
        <br className="hidden sm:block" />— simple, controlled, and trackable
      </h2>

      <div className="mt-10 grid gap-3 lg:grid-cols-3">
        {steps.map((item, idx) => (
          <article key={idx} className="relative border border-black/12 bg-[#f5f5f4]">
            {/* Card corner brackets */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
              <span className="absolute left-0 top-0 h-3.5 w-3.5 " />
              <span className="absolute right-0 top-0 h-3.5 w-3.5 " />
              <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l !border-black/50" />
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r !border-black/50" />
            </span>


            <div className="relative h-[290px] overflow-hidden border-b border-black/10">
              <img
                src={item.panelImage}
                alt="Step visual"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Text block */}
            <div className="px-5 py-5 sm:px-6">
              <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs text-black/45">
                <span className="h-3 w-[2px] bg-black/25" />
                <span>{item.stepLabel}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-medium leading-snug tracking-[-0.03em] text-black/90">
                {item.title}
              </h3>

              <p className="mt-2 text-sm sm:text-base leading-relaxed text-black/55">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;