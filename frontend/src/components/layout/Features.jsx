// components/Features.tsx
import React from 'react';
import { Upload, Share2, Shield, Folder, Zap, Users } from 'lucide-react';



const features = [
  {
    icon: Upload,
    title: "Easy File Upload",
    description: "Drag and drop files or click to upload. Support for all file types with bulk upload capability.",
  },
  {
    icon: Share2,
    title: "Secure Sharing",
    description: "Share files with anyone using secure links. Control access and set expiration dates.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption for your files. Your data is protected with industry-leading security.",
  },
  {
    icon: Folder,
    title: "Smart Organization",
    description: "Organize files into folders. Search and filter to find what you need instantly.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed. Upload, download, and share files in seconds, not minutes.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly. Share folders with your team and collaborate in real-time.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-32 bg-slate-50/50" data-testid="features-section">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
            Features
          </div>
          <h2 className="text-4xl md:text-6xl font-[900] tracking-tighter text-slate-900 mb-6" data-testid="features-title">
            Everything you need to manage your files
          </h2>
          <p className="text-lg text-slate-500 font-medium" data-testid="features-description">
            Powerful features designed to make file management effortless
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 hover:translate-y-[-4px]"
              data-testid={`feature-card-${index}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
                <feature.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;