// components/FAQ.tsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';


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
    <section id="faq" className="py-32 bg-slate-50/50" data-testid="faq-section">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-[900] tracking-tighter text-slate-900 mb-6" data-testid="faq-title">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-500 font-medium" data-testid="faq-description">
            Everything you need to know about FileVault Pro
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === index 
                  ? 'border-indigo-200 shadow-lg shadow-indigo-50' 
                  : 'border-slate-100 hover:border-slate-200'
              }`}
              data-testid={`faq-item-${index}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4"
              >
                <h3 className="text-lg font-bold text-slate-900">{faq.question}</h3>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-6 text-slate-500 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;