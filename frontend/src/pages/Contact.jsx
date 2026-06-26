import { useState } from "react";
import StaticPageLayout from "../components/layout/StaticPageLayout";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <StaticPageLayout
      eyebrow="Contact"
      title="Reach out"
    >

      {!submitted ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-8"
        >
          <p className="text-muted-foreground">
            Questions about architecture, security, or the system design?
            Send a message and I’ll respond directly.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">

            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                required
                className="border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                required
                className="border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Message
            </label>
            <textarea
              rows={6}
              required
              className="border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <button
            type="submit"
            className="h-10 border border-foreground bg-foreground px-6 font-mono text-xs text-background transition hover:opacity-85 active:scale-[0.97]"
          >
            Send Message
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl tracking-tight">Message received.</h2>
          <p className="text-muted-foreground">
            I’ll get back to you as soon as possible.
          </p>
        </div>
      )}

    </StaticPageLayout>
  );
};

export default Contact;