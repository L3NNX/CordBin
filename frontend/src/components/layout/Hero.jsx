import React from "react";
import { useNavigate } from "react-router-dom";
import heroGif from "../../assets/hero.gif";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">

      {/* Outer frame corner brackets */}
      <span className="pointer-events-none absolute inset-0 z-30">
        <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-foreground/40" />
        <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-foreground/40" />
        <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-foreground/40" />
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-foreground/40" />
      </span>

      <div className="grid border-b border-border lg:grid-cols-2">

        {/* LEFT PANEL */}
        <div className="flex flex-col border-b border-border lg:border-b-0 lg:border-r">

          <div className="flex flex-col px-6 pt-8 pb-6 sm:px-10 sm:pt-10 sm:pb-8 lg:px-14 lg:pt-12 lg:pb-10 xl:px-16 xl:pt-14 xl:pb-10">

            {/* Eyebrow */}
            <div className="relative mb-6 inline-flex w-fit items-center border border-border px-1 py-1">
              <span className="bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
                BETA
              </span>
              <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                Encrypted Object Storage
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[2.4rem] sm:text-[2.8rem] lg:text-[3.3rem] leading-[0.95] tracking-[-0.04em] max-w-[520px]">
              Secure storage without
              <br />
              infrastructure overhead
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-[520px] text-muted-foreground text-sm sm:text-base md:text-lg lg:mt-6 lg:text-xl">
              Store encrypted objects using AES-256-GCM with resumable chunked uploads,
              streaming decryption, and token-based access control.
            </p>

            {/* Buttons */}
            <div className="mt-7 flex flex-wrap gap-3 lg:mt-9 lg:gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="h-10 border border-primary bg-primary px-4 text-sm text-primary-foreground hover:bg-neutral-800"
              >
                Open Console
              </button>

              <button className="h-10 border border-border bg-background px-4 text-sm hover:bg-muted">
                View Architecture
              </button>
            </div>

          </div>

          {/* Trusted block */}
          <div className="border-t border-border">
            <div className="border-b border-border px-4 py-2.5 sm:px-6 lg:px-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Built for secure distribution
              </p>
            </div>

            <div className="grid grid-cols-3">
              {[
                "AES-256-GCM",
                "Chunked Uploads",
                "Resumable Transfers",
                "Token Access",
                "Streaming Decryption",
                "Discord Backend",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex h-14 items-center justify-center border-b border-r border-border sm:h-16 lg:h-20"
                >
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="relative m-1 min-h-[300px] overflow-hidden sm:min-h-[420px] lg:min-h-[520px]">

          <div className="absolute overflow-hidden border border-border bg-black sm:bottom-8 sm:left-8 sm:top-8 lg:bottom-12 lg:left-0 lg:top-12">
            <img
              src={heroGif}
              alt="Encrypted Storage Console Preview"
              className="h-full w-full object-contain"
              draggable={false}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Hero;