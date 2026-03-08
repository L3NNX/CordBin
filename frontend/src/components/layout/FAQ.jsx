import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const faqs = [
  {
    question: "How secure is my data?",
    answer: "We use bank-level 256-bit encryption for all files. Your data is encrypted both in transit and at rest. We never access your files without your permission.",
  },
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer: "Yes! You can change your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, the credit will be applied to your next billing cycle.",
  },
  {
    question: "What file types are supported?",
    answer: "We support all file types including documents, images, videos, audio files, archives, and more. There are no restrictions on file types.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Free users can upload files up to 2GB each. Pro and Enterprise users have no file size limits.",
  },
  {
    question: "Can I share files with people who don't have an account?",
    answer: "Absolutely! You can generate secure sharing links that anyone can access, regardless of whether they have an account.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment in full.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-28 md:py-36 bg-muted/50" data-testid="faq-section">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-5 py-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
              Support
            </span>
          </div>

          <h2
            className="font-display text-3xl tracking-tight text-foreground sm:text-4xl md:text-[3.25rem] md:leading-[1.15]"
            data-testid="faq-title"
          >
            Frequently asked{' '}
            <span className="gradient-text">questions</span>
          </h2>

          <p className="mt-5 text-base text-muted-foreground sm:text-lg" data-testid="faq-description">
            Everything you need to know about CordBin
          </p>
        </div>

        {/* FAQ items */}
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={cn(
                  "rounded-xl border bg-card overflow-hidden transition-all duration-300",
                  isOpen
                    ? "border-accent/25 shadow-lg shadow-accent/5"
                    : "border-border hover:border-border/80"
                )}
                data-testid={`faq-item-${index}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                >
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 transition-all duration-300",
                      isOpen
                        ? "rotate-180 text-accent"
                        : "text-muted-foreground"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-96" : "max-h-0"
                  )}
                >
                  <p className="px-5 pb-5 leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;