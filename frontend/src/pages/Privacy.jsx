import StaticPageLayout from "../components/layout/StaticPageLayout";

const Privacy = () => {
  return (
    <StaticPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
    >

      <section className="space-y-6">
        <p>
          This Privacy Policy describes how CordBin collects, uses, and protects
          information when you use the service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">1. Data You Store</h2>
        <p>
          All files uploaded to CordBin are encrypted client‑side using
          AES‑256‑GCM before transmission. Encrypted data is stored on
          Discord infrastructure as segmented chunks.
        </p>
        <p>
          CordBin does not have access to plaintext file contents unless
          decryption occurs within the authenticated retrieval process.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">2. Metadata</h2>
        <p>
          To enable object reconstruction and retrieval, CordBin stores
          metadata such as:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Object identifiers</li>
          <li>Chunk references</li>
          <li>Upload timestamps</li>
          <li>Storage usage statistics</li>
          <li>Access tokens and expiry data</li>
        </ul>
        <p>
          Metadata does not contain decrypted file contents.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">3. Account Information</h2>
        <p>
          If authentication is used, basic account data such as email address
          and encrypted credentials may be stored for access control.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">4. Logs & Operational Data</h2>
        <p>
          For infrastructure stability and abuse prevention, CordBin may log:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>API request metadata</li>
          <li>Rate limit responses</li>
          <li>Transfer status events</li>
        </ul>
        <p>
          Logs are used strictly for system health and are not sold or shared.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">5. Third-Party Infrastructure</h2>
        <p>
          Encrypted object chunks are stored on Discord's infrastructure.
          By using CordBin, you acknowledge that encrypted storage depends
          on Discord's API and Terms of Service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">6. Data Deletion</h2>
        <p>
          Users may delete objects at any time. Deletion removes both
          metadata records and associated encrypted storage chunks.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">7. Contact</h2>
        <p>
          For privacy-related inquiries, contact: support@cordbin.io
        </p>
      </section>

      <p className="font-mono text-xs text-muted-foreground">
        Last updated: {new Date().getFullYear()}
      </p>

    </StaticPageLayout>
  );
};

export default Privacy;