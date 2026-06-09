// components/layout/Testimonials.jsx
import React from "react";

const testimonials = [
  {
    content: "CordBin finally gave us a single place to reason about files and sharing.",
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
  },
  {
    content:
      "Before CordBin, file sharing was scattered across tools. Now every share runs through the same permission layer — consistently.",
    name: "Michael Chen",
    role: "Freelance Designer",
    company: "Independent",
  },
  {
    content:
      "CordBin reduced collaboration anxiety across the team. Fewer broken links, fewer access issues, fewer last‑minute surprises.",
    name: "Emily Rodriguez",
    role: "Project Manager",
    company: "Creative Studio",
  },
  {
    content:
      "We used to rely on tribal knowledge for folders and permissions. With CordBin, policies live in the workspace — not in people's heads.",
    name: "Daniel Foster",
    role: "Engineering Lead",
    company: "SparkPoint",
  },
  {
    content:
      "Reviewing changes became faster because context is already there. You don't need to ask what happened — you can see it.",
    name: "Aylin Demir",
    role: "Co-founder",
    company: "BuildOps",
  },
  {
    content:
      "We replaced multiple sharing workflows with one system. Admin overhead dropped immediately.",
    name: "Ryan Mitchell",
    role: "Founder",
    company: "Taskly",
  },
  {
    content:
      "What surprised us most was how little setup it needed. We were securely sharing large files within the first day.",
    name: "Lina Berg",
    role: "Product Marketing Manager",
    company: "DataFuse",
  },
  {
    content:
      "We stopped discovering access problems after sending links. Catching permission issues early changed how confidently we ship deliverables.",
    name: "Marcus Reed",
    role: "Product Designer",
    company: "Connectly",
  },
  {
    content:
      "Production readiness is no longer a checklist — it’s enforced. That shift alone changed our security culture.",
    name: "Lucas Bennett",
    role: "Creative Director",
    company: "LaunchLab",
  },

  // dim row (like Nextflow)
  {
    content:
      "It feels like infrastructure, not another tool. CordBin fades into the background and just keeps sharing reliable.",
    name: "Alex Morgan",
    role: "Head of Growth",
    company: "CloudSync",
    dim: true,
  },
  {
    content:
      "The activity timeline alone is worth it. Seeing uploads, shares, and access in one flow saves hours every week.",
    name: "Julia Novak",
    role: "Head of Marketing",
    company: "PayNow",
    dim: true,
  },
  {
    content:
      "It's the first system that made file governance feel intentional. Not reactive. Not manual. Just built‑in.",
    name: "Maya Rodriguez",
    role: "SaaS Growth Consultant",
    company: "",
    dim: true,
  },
];

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({ content, name, role, company, dim }) {
  return (
    <article
      className={`relative border px-5 py-5 sm:px-6 sm:py-6 bg-[#f6f6f5] h-full flex flex-col justify-between ${
        dim ? "border-black/10" : "border-black/15"
      }`}
    >
      {/* Card corner brackets */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
        <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-black/30" />
        <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-black/30" />
        <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-black/30" />
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-black/30" />
      </span>

      <p className={`text-sm sm:text-base leading-relaxed ${dim ? "text-black/35" : "text-black/65"}`}>
        {content}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <span
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border font-mono text-[0.62rem] tracking-wide ${
            dim
              ? "border-black/8 bg-black/[0.03] text-black/25"
              : "border-black/18 bg-black/[0.06] text-black/70"
          }`}
        >
          <img
            alt={name}
            loading="lazy"
            decoding="async"
            width={40}
            height={40}
            className={`h-full w-full object-cover grayscale-100 brightness-125 contrast-75 ${dim ? "opacity-45" : ""}`}
            src={`https://dummyimage.com/80x80/bdbdbd/000000&text=${encodeURIComponent(
              initials(name)
            )}`}
          />
        </span>

        <div>
          <p className={`font-mono text-sm ${dim ? "text-black/35" : "text-black/80"}`}>{name}</p>
          <p className={`font-mono text-xs ${dim ? "text-black/25" : "text-black/50"}`}>
            {role}
            {company ? ` at ${company}` : ""}
          </p>
        </div>
      </div>
    </article>
  );
}

const Testimonials = () => {
  return (
    <div
      id="testimonials"
      className="relative border border-black/12 bg-[#f3f3f2] px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
      data-testid="testimonials-section"
    >
      {/* Panel corner brackets */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
        <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-black/30" />
        <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-black/30" />
        <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-black/30" />
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-black/30" />
      </span>

      <div className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-black/50">
        <span className="h-3.5 w-[2px] bg-black/40" />
        <span>Testimonials</span>
      </div>

      <h2 className="max-w-[700px] text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] leading-[0.95] tracking-[-0.04em] text-black/90">
        Trusted by teams shipping
        <br className="hidden sm:block" />
        to production
      </h2>

      {/* Symmetrical card grid */}
      <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
        {testimonials.map((t, idx) => (
          <TestimonialCard key={idx} {...t} />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;