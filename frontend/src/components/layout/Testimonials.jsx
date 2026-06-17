// components/layout/Testimonials.jsx
import React from "react";

const testimonials = [
  {
    content:
      "Using Discord as a storage backend sounded risky — until we saw the rate‑limit orchestration in action. It’s surprisingly resilient.",
    name: "Arjun Mehta",
    role: "Backend Engineer",
    company: "InfraStack",
  },
  {
    content:
      "Chunked uploads with resume support saved us countless failed transfers on unstable networks. Large objects just complete.",
    name: "Elena Kovács",
    role: "DevOps Lead",
    company: "ScaleOps",
  },
  {
    content:
      "Client‑side AES‑256‑GCM encryption before upload means we never rely on third‑party storage for trust. That’s a big shift.",
    name: "Noah Kim",
    role: "Security Engineer",
    company: "CipherWorks",
  },
  {
    content:
      "The multi‑channel distribution layer makes Discord behave like a distributed object store. That abstraction is impressive.",
    name: "Marta Silva",
    role: "Systems Architect",
    company: "GridLayer",
  },
  {
    content:
      "We’ve pushed thousands of objects through it. No bans. No Cloudflare lockouts. The rate‑limit manager does its job.",
    name: "Daniel Ross",
    role: "Platform Engineer",
    company: "DeployCore",
  },
  {
    content:
      "Streaming decryption allows us to preview encrypted objects without exposing raw storage. It feels like a real storage engine.",
    name: "Hiro Tanaka",
    role: "Product Engineer",
    company: "SecureLabs",
  },
  {
    content:
      "Token‑based access control made secure distribution trivial. We don’t leak internal structure anymore.",
    name: "Fatima Rahman",
    role: "Infrastructure Lead",
    company: "CloudMesh",
  },
  {
    content:
      "We replaced traditional bucket storage with Discord infrastructure — and the abstraction layer made it viable.",
    name: "Jonas Weber",
    role: "CTO",
    company: "NodeFlow",
  },
  {
    content:
      "CordBin behaves less like a file app and more like a controlled object registry.",
    name: "Isabella Marino",
    role: "Distributed Systems Engineer",
    company: "DataForge",
  },

  // dim row
  {
    content:
      "The channel pool logic alone prevents API saturation. That level of defensive design is rare.",
    name: "Victor Alvarez",
    role: "API Engineer",
    company: "",
    dim: true,
  },
  {
    content:
      "We treat it as an encrypted object layer, not a file host. That distinction matters.",
    name: "Grace Lee",
    role: "Security Architect",
    company: "",
    dim: true,
  },
  {
    content:
      "It abstracts Discord’s limits into a predictable storage interface. That’s the real value.",
    name: "Ravi Nair",
    role: "Infrastructure Consultant",
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
        <span>Engineering Feedback</span>
      </div>

      <h2 className="max-w-[700px] text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] leading-[0.95] tracking-[-0.04em] text-black/90">
        Used by engineers building
        <br className="hidden sm:block" />
        secure systems
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