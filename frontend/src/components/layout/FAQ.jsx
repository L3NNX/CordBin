// components/layout/FAQ.tsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "../../lib/utils";

const faqs = [
  {
    question: "How is my data secured?",
    answer:
      "All objects are encrypted client-side using AES-256-GCM before being uploaded. Discord only stores encrypted chunks. Decryption occurs only during authorized retrieval.",
  },
  {
    question: "Where are my files actually stored?",
    answer:
      "Objects are distributed across private Discord channels. Metadata is stored separately in MongoDB, allowing secure reassembly without exposing raw storage structure.",
  },
  {
    question: "How do you handle Discord rate limits?",
    answer:
      "CordBin tracks global and per-route rate limits in real time, distributing uploads across multiple channels and automatically retrying when necessary to prevent API bans.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "Files are split into encrypted chunks to comply with Discord limits. There is no hard object size restriction, but practical limits depend on your storage tier and channel pool configuration.",
  },
  {
    question: "How does sharing work?",
    answer:
      "Access tokens are generated per object. Tokens can be time-limited and revoked at any time. Shared users never see internal Discord URLs or chunk metadata.",
  },
  {
    question: "Can uploads resume if interrupted?",
    answer:
      "Yes. Upload progress is tracked per chunk. If a transfer is interrupted, only remaining encrypted chunks are uploaded.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div
      id="faqs"
      className="relative border border-black/12 bg-[#f3f3f2] px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
      data-testid="faq-section"
    >
      {/* Panel corner brackets */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
        <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-black/50" />
        <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-black/50" />
        <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-black/50" />
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-black/50" />
      </span>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        {/* Left sticky column */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-black/50">
            <span className="h-3.5 w-[4px] bg-black/40" />
            <span>FAQ</span>
          </div>

          <h2 className="text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] leading-[0.95] tracking-[-0.04em] text-black/90">
            Questions we
            <br />
            get asked
          </h2>

          <p className="mt-5 max-w-[320px] text-sm sm:text-base leading-relaxed text-black/55">
            Can't find what you're looking for? Reach out and we'll get back to you within one
            business day.
          </p>

          <a
            className="relative mt-6 inline-flex h-11 items-center border border-black/15 bg-white px-6 font-mono text-sm text-black/80 transition-colors hover:bg-black/5"
            href="/contact"
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-0">
              <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t !border-l-black/50 !border-t-black/50" />
              <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t !border-r-black/50 !border-t-black/50" />
              <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l !border-b-black/50 !border-l-black/50" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r !border-b-black/50 !border-r-black/50" />
            </span>
            Contact us
          </a>
        </div>

        {/* FAQ list */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <article key={index} className="relative border border-black/12 bg-[#f6f6f5]">
                {/* Card corner brackets */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
                  <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t !border-black/50" />
                  <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t !border-black/50" />
                  <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l !border-black/50" />
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r !border-black/50" />
                </span>

                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-6 px-5 py-5 text-left sm:px-6 sm:py-6"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span
                    className={cn(
                      "text-sm sm:text-base font-medium leading-snug tracking-[-0.01em] transition-colors duration-200",
                      isOpen ? "text-black/90" : "text-black/75"
                    )}
                  >
                    {faq.question}
                  </span>

                  <span className="relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-black/15 bg-[#f0f0ef] text-black/60 transition-colors duration-200">
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
                      <span className="absolute left-0 top-0 h-1.5 w-1.5 border-l border-t border-l-black border-t-black" />
                      <span className="absolute right-0 top-0 h-1.5 w-1.5 border-r border-t border-r-black border-t-black" />
                      <span className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-b-black border-l-black" />
                      <span className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-b-black border-r-black" />
                    </span>

                    <Plus
                      className={cn("size-3 transition-transform duration-200", isOpen && "rotate-45")}
                    />
                  </span>
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-black/[0.08] px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                      <p className="max-w-[820px] text-sm sm:text-base leading-relaxed text-black/55">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;