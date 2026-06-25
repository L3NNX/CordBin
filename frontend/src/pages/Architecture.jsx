import StaticPageLayout from "../components/layout/StaticPageLayout";

const Architecture = () => {
  return (
    <StaticPageLayout
      eyebrow="Architecture"
      title="Encrypted distributed object storage"
    >

      <section className="space-y-4">
        <h2 className="text-xl">System Overview</h2>
        <p>
          CordBin operates as a distributed encrypted object storage layer built on top
          of Discord’s infrastructure. The system separates encryption, orchestration,
          distribution, and metadata management into isolated layers.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl">Client & Encryption Layer</h2>
        <p>
          Objects are encrypted client-side using authenticated AES‑256‑GCM before
          leaving the user’s device. Discord never stores unencrypted file data.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl">Transfer Orchestration</h2>
        <p>
          Files are divided into optimized chunks to comply with infrastructure
          constraints. Upload sessions are resumable and resilient against interruption.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl">Distribution & API Compliance</h2>
        <p>
          CordBin distributes encrypted chunks across multiple channels while
          respecting global and bucket-level API limits. Adaptive request pacing
          ensures stability under sustained load.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl">Metadata & Retrieval</h2>
        <p>
          Metadata is stored separately to enable deterministic reassembly during
          retrieval. Downloads stream and decrypt objects in real time without
          exposing raw storage endpoints.
        </p>
      </section>

    </StaticPageLayout>
  );
};
export default Architecture;