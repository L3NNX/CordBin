import React, { useState, useEffect, useRef, useCallback } from "react";
import { ShieldCheck, Code, Activity, SquareCheckBig } from "lucide-react";
import { Button } from "../ui/button";
import ArchitectureDiagram from "./ArchitectureDiagram";
import feature from "../../assets/feature.png";
const featureList = [
  {
    icon: ShieldCheck,
    title: "Client-Side AES-256-GCM Encryption",
    description:
      "All objects are encrypted before upload using AES-256-GCM, ensuring data confidentiality even across third-party infrastructure.",
  },
  {
    icon: Code,
    title: "Resumable Chunked Uploads",
    description:
      "Large files are split into secure chunks with automatic retry and resume support for unstable network conditions.",
  },
  {
    icon: Activity,
    title: "Streaming Decryption",
    description:
      "Download and preview encrypted objects with on-the-fly decryption, without exposing raw storage data.",
  },
  {
    icon: SquareCheckBig,
    title: "Token-Based Access Control",
    description:
      "Generate secure, time‑limited access tokens for sharing encrypted objects without revealing internal storage structure.",
  },
];
const INTERVAL_MS = 3500;

// One bar per feature item — manages its own Web Animations API instance
const ProgressBar = ({ active, paused }) => {
  const ref = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    animRef.current?.cancel();

    if (!active) {
      ref.current.style.width = "0%";
      return;
    }

    animRef.current = ref.current.animate(
      [{ width: "0%" }, { width: "100%" }],
      { duration: INTERVAL_MS, easing: "linear", fill: "forwards" }
    );

    if (paused) animRef.current.pause();

    return () => animRef.current?.cancel();
  }, [active]);

  useEffect(() => {
    if (!animRef.current) return;
    if (paused) animRef.current.pause();
    else animRef.current.play();
  }, [paused]);

  return (
    <div
      ref={ref}
      className="absolute bottom-0 left-0 h-0.5 bg-foreground"
      style={{ width: "0%" }}
    />
  );
};

const Features = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featureList.length);
    }, INTERVAL_MS);
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [startTimer]);

  useEffect(() => {
    if (paused) clearInterval(intervalRef.current);
    else startTimer();
    return () => clearInterval(intervalRef.current);
  }, [paused, startTimer]);

  const handleClick = (i) => {
    setActiveIndex(i);
    startTimer();
  };

  return (
    <div className="relative border border-border bg-secondary p-6 sm:p-8 lg:p-10">

      {/* Corner brackets */}
      <span className="pointer-events-none absolute inset-0 z-10">
        <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-foreground/40" />
        <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-foreground/40" />
        <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-foreground/40" />
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-foreground/40" />
      </span>

      {/* Header */}
      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-foreground/50">
            <span className="h-3.5 w-[4px] bg-foreground/40" />
            <span>Features</span>
          </div>
          <h2 className="max-w-[700px] text-[2.4rem] sm:text-[2.8rem] lg:text-[3.3rem] leading-[0.95] tracking-[-0.04em] font-normal">
            Built for resilient
            <br className="hidden sm:block" />
            object distribution
          </h2>
        </div>

        <div className="lg:pt-14">
          <p className="max-w-[320px] text-base sm:text-lg leading-relaxed text-foreground/60">
            Encrypted object storage powered by Discord infrastructure, designed for secure distribution and controlled access.
          </p>
          <div className="mt-6">
            <Button variant="corner">View Architecture</Button>
          </div>
        </div>
      </div>

      {/* Feature list + image */}
      <div className="mt-10 grid gap-3 lg:grid-cols-[1fr_1.5fr] lg:items-stretch">

        <div className="flex h-full flex-col gap-3">
          {featureList.map((feature, i) => {
            const isActive = activeIndex === i;
            const Icon = feature.icon;

            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                className="flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <article
                  className={`relative h-full overflow-hidden border bg-card px-6 py-7 sm:px-8 transition-colors duration-200 ${isActive ? "border-foreground/20" : "border-border hover:border-foreground/15"
                    }`}
                >
                  {/* Corner marks */}
                  <span className="pointer-events-none absolute inset-0 z-10">
                    <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t !border-black" />
                    <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t !border-black" />
                    <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l !border-black" />
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r !border-black" />
                  </span>

                  <div className="flex items-start gap-4">
                    <Icon
                      className={`mt-1 size-5 shrink-0 transition-colors duration-200 ${isActive ? "text-foreground/70" : "text-foreground/30"
                        }`}
                    />
                    <div className="flex-1">
                      <h3
                        className={`text-base sm:text-lg font-medium leading-snug transition-colors duration-200 ${isActive ? "text-foreground" : "text-foreground/40"
                          }`}
                      >
                        {feature.title}
                      </h3>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-out ${isActive ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"
                          }`}
                      >
                        <p className="text-sm sm:text-base leading-relaxed text-foreground/55">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Track */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-foreground/[0.06]">
                    <ProgressBar active={isActive} paused={paused} />
                  </div>
                </article>
              </button>
            );
          })}
        </div>

        {/* Image panel */}
        <div className="relative border border-border p-4">
           <img
                        src={feature}
                        alt="Encrypted Storage Console Preview"
                        className="h-full w-full object-contain"
                        draggable={false}
                      />
        </div>
      </div>
    </div>
  );
};

export default Features;