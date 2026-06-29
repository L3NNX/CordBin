// components/layout/Footer.jsx
import React from "react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Architecture", href: "/architecture" },
      { label: "Security", href: "/security" },
      { label: "Capacity Tiers", href: "/pricing" },
      { label: "System Status", href: "/status" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "REST API", href: "/docs" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { label: "X", href: "https://x.com" },
  { label: "GH", href: "https://github.com" },
  { label: "IN", href: "https://linkedin.com" },
];

const Footer = () => {
  return (
    <footer className="w-full px-3 sm:px-6 lg:px-8" data-testid="footer">
      <div className="mx-auto w-full max-w-[1720px] border-x border-black/12">
        <div className="relative border border-black/12 bg-[#f3f3f2]">
          {/* Corner brackets */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
            <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-black/30" />
            <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-black/30" />
            <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-black/30" />
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-black/30" />
          </span>

          <div className="grid gap-12 px-6 pt-10 pb-10 sm:px-8 sm:pt-12 lg:grid-cols-[1.2fr_2fr] lg:px-10 lg:pt-14">
            {/* Brand */}
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2">
                <div className="relative flex h-8 w-8 items-center justify-center bg-inherit">
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <span className="absolute left-0 top-0 h-1.5 w-1.5 border-l border-t border-black/30" />
                    <span className="absolute right-0 top-0 h-1.5 w-1.5 border-r border-t border-black/30" />
                    <span className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-black/30" />
                    <span className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-black/30" />
                  </span>
                  <img src="/favicon.svg" alt="CordBin" className="h-8 w-8" />
                </div>

                <span className="font-mono text-sm font-medium tracking-wide text-black/85">
                  CordBin
                </span>
              </div>

              <p className="max-w-[280px] text-sm leading-relaxed text-black/55">
                Secure file storage and sharing for teams. Centralize access, control permissions,
                and keep collaboration reliable.
              </p>

              {/* Social */}
              <div className="flex items-center gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex h-8 w-8 items-center justify-center border border-black/12 bg-white font-mono text-xs text-black/55 transition-colors hover:bg-black/5 hover:text-black/80"
                    aria-label={item.label}
                  >
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
                      <span className="absolute left-0 top-0 h-1.5 w-1.5 border-l border-t border-black/30" />
                      <span className="absolute right-0 top-0 h-1.5 w-1.5 border-r border-t border-black/30" />
                      <span className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-black/30" />
                      <span className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-black/30" />
                    </span>
                    {item.label}
                  </a>
                ))}
              </div>

              {/* Status */}
              <div className="inline-flex w-fit items-center gap-2 border border-black/10 bg-white px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-xs text-black/55">All systems operational</span>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {footerLinks.map((group) => (
                <div key={group.title}>
                  <p className="mb-4 font-mono text-xs uppercase tracking-widest text-black/40">
                    {group.title}
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-sm text-black/60 transition-colors hover:text-black/90"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-black/10 px-6 py-5 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-xs text-black/40">
                © {new Date().getFullYear()} CordBin. All rights reserved.
              </p>

              <div className="flex items-center gap-6">
                <a className="font-mono text-xs text-black/40 transition-colors hover:text-black/70" href="/privacy">
                  Privacy
                </a>
                <a className="font-mono text-xs text-black/40 transition-colors hover:text-black/70" href="/terms">
                  Terms
                </a>
                <a className="font-mono text-xs text-black/40 transition-colors hover:text-black/70" href="#">
                  Cookies
                </a>
                <span className="font-mono text-xs text-black/30">v1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;