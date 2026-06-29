import React from "react";

const StaticPageLayout = ({ eyebrow, title, children }) => {
  return (
    <div className="relative border border-border bg-background px-8 py-16">

      <span className="pointer-events-none absolute inset-0">
        <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-foreground/40" />
        <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-foreground/40" />
        <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-foreground/40" />
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-foreground/40" />
      </span>

      <div className="mx-auto max-w-4xl space-y-12">

        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="text-4xl tracking-[-0.04em]">
            {title}
          </h1>
        </div>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          {children}
        </div>

      </div>
    </div>
  );
};

export default StaticPageLayout;