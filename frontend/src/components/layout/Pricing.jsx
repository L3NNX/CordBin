
import React, { useState } from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Starter",
    price: "0",
    desc: "Perfect for casual storage",
    features: ["10GB Encrypted Storage", "Basic Share Links", "Mobile Access", "Standard Support"],
    cta: "Join Free",
    featured: false
  },
  {
    name: "Pro",
    price: "12",
    desc: "The professional's choice",
    features: ["1TB Fast Storage", "Semantic AI Search", "Password Protection", "Priority Syncing", "Version History"],
    cta: "Start Free Trial",
    featured: true
  },
  {
    name: "Team",
    price: "49",
    desc: "Built for scaling teams",
    features: ["Unlimited Storage", "Custom Domain Links", "SSO/SAML Login", "Admin Dashboard", "Audit Logs"],
    cta: "Contact Sales",
    featured: false
  }
];

const Pricing= () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-32 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#171717] mb-6">Simple, honest pricing.</h2>
        <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto">Choose a plan that scales with your growth. No hidden fees, no complexity.</p>

        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-semibold ${!isYearly ? 'text-[#171717]' : 'text-gray-400'}`}>Monthly</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-8 bg-gray-100 rounded-full p-1 relative flex items-center transition-colors"
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
          <span className={`text-sm font-semibold ${isYearly ? 'text-[#171717]' : 'text-gray-400'}`}>
            Yearly <span className="text-indigo-600 font-bold ml-1">(-20%)</span>
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((p, i) => (
            <div 
              key={i} 
              className={`relative p-10 rounded-[2.5rem] border text-left transition-all duration-300 hover:shadow-2xl hover:translate-y-[-8px] ${
                p.featured ? 'ring-1 ring-indigo-500 bg-indigo-50 shadow-xl' : 'border-gray-100 bg-white'
              }`}
            >
              {p.featured && (
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-[#171717] mb-2">{p.name}</h3>
              <p className="text-sm text-gray-500 mb-8">{p.desc}</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-extrabold text-[#171717]">${isYearly ? Math.floor(parseInt(p.price) * 0.8) : p.price}</span>
                <span className="text-gray-500 font-medium">/mo</span>
              </div>

              <button className={`w-full py-4 rounded-2xl font-bold text-sm mb-10 transition-all ${
                p.featured ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-white border border-gray-200 text-[#171717] hover:border-indigo-600 hover:text-indigo-600'
              }`}>
                {p.cta}
              </button>

              <ul className="space-y-4">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-[#525252]">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
