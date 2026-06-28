import StaticPageLayout from "../components/layout/StaticPageLayout";

const Security = () => {
  return (
    <StaticPageLayout
      eyebrow="Security"
      title="Encryption, access control & infrastructure safeguards"
    >

      {/* Encryption */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">Client-Side Encryption</h2>
        <p>
          All objects uploaded to CordBin are encrypted client‑side using
          AES‑256‑GCM before transmission. Encrypted chunks are the only data
          stored on Discord infrastructure.
        </p>
        <p>
          Encryption occurs prior to chunk segmentation, ensuring no plaintext
          data is persisted externally.
        </p>
      </section>

      {/* Access Model */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">Access Control</h2>
        <p>
          Retrieval requires a scoped access token. Tokens may include
          expiration constraints and can be revoked at any time.
        </p>
        <p>
          Direct Discord storage endpoints are never exposed to external users.
        </p>
      </section>

      {/* Infrastructure Compliance */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">Rate-Limit Compliance</h2>
        <p>
          CordBin monitors global and per-route API responses to maintain
          infrastructure compliance. Adaptive request pacing ensures service
          continuity while preventing abuse.
        </p>
        <p>
          Invalid request detection mechanisms help prevent service disruption.
        </p>
      </section>

      {/* Data Integrity */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">Data Integrity</h2>
        <p>
          Metadata is stored separately from encrypted object chunks, enabling
          deterministic reconstruction and streaming retrieval.
        </p>
      </section>

      {/* Disclosure */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">Responsible Disclosure</h2>
        <p>
          Security issues can be reported to:
        </p>
        <p className="font-mono text-sm">security@cordbin.io</p>
      </section>

    </StaticPageLayout>
  );
};

export default Security;