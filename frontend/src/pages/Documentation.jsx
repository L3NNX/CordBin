import StaticPageLayout from "../components/layout/StaticPageLayout";

const Documentation = () => {
  return (
    <StaticPageLayout
      eyebrow="Documentation"
      title="Developer & system reference"
    >

      {/* Overview */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">Overview</h2>
        <p>
          CordBin provides an encrypted object storage interface built on top of
          Discord infrastructure. The system separates encryption, chunk
          orchestration, metadata management, and API compliance into
          isolated operational layers.
        </p>
        <p>
          This documentation outlines the object lifecycle, access model,
          and architectural guarantees.
        </p>
      </section>

      {/* Object Lifecycle */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">Object Lifecycle</h2>

        <div className="space-y-4">
          <h3 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            1. Encryption
          </h3>
          <p>
            Objects are encrypted client‑side using AES‑256‑GCM prior to upload.
            Discord never receives plaintext data.
          </p>

          <h3 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            2. Chunk Distribution
          </h3>
          <p>
            Encrypted data is segmented into optimized chunks to comply with
            infrastructure constraints. Upload sessions are resumable and
            state-aware.
          </p>

          <h3 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            3. Metadata Registration
          </h3>
          <p>
            Object metadata is stored separately to enable deterministic
            reconstruction and streaming retrieval.
          </p>

          <h3 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            4. Retrieval & Streaming
          </h3>
          <p>
            Retrieval requests fetch encrypted chunks, reassemble them, and
            decrypt the object on demand through a streaming pipeline.
          </p>
        </div>
      </section>

      {/* Access Model */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">Access Model</h2>
        <p>
          Object access is controlled via scoped tokens. Tokens may include
          expiration constraints and can be revoked at any time.
        </p>
        <p>
          Direct storage endpoints are never exposed to external consumers.
        </p>
      </section>

      {/* API Surface */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">API Surface</h2>
        <p>
          CordBin exposes REST endpoints for object upload, metadata queries,
          streaming download, sharing, and lifecycle management.
        </p>

        <div className="rounded-lg border border-border bg-muted/30 p-6 font-mono text-xs">
{`POST   /api/upload/init
POST   /api/upload/chunk
GET    /api/object/:id
POST   /api/share/create
DELETE /api/object/:id`}
        </div>

        <p className="text-sm text-muted-foreground">
          Detailed API reference and SDK documentation will be published
          separately.
        </p>
      </section>

      {/* Infrastructure Notes */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">Infrastructure Compliance</h2>
        <p>
          The system actively monitors API responses and adapts request pacing
          to remain compliant with infrastructure constraints.
        </p>
        <p>
          Rate compliance, retry strategies, and channel distribution logic are
          abstracted within the orchestration layer.
        </p>
      </section>

      {/* Versioning */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">Version</h2>
        <p className="font-mono text-sm text-muted-foreground">
          Documentation Version: v1.0.0
        </p>
      </section>

    </StaticPageLayout>
  );
};

export default Documentation;