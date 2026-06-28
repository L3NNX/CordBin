import StaticPageLayout from "../components/layout/StaticPageLayout";

const Terms = () => {
  return (
    <StaticPageLayout
      eyebrow="Legal"
      title="Terms of Service"
    >

      <section className="space-y-6">
        <p>
          These Terms govern your use of CordBin. By accessing or using the
          service, you agree to comply with these terms.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">1. Service Description</h2>
        <p>
          CordBin provides encrypted object storage leveraging Discord
          infrastructure. Objects are encrypted client‑side and distributed
          as segmented chunks.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">2. Acceptable Use</h2>
        <p>
          You agree not to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Store illegal or prohibited content</li>
          <li>Attempt to bypass API rate limits</li>
          <li>Abuse infrastructure constraints</li>
          <li>Reverse engineer the service</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">3. Infrastructure Dependency</h2>
        <p>
          The service depends on Discord’s API and availability. CordBin
          does not guarantee uninterrupted access and is not responsible
          for outages caused by third‑party infrastructure.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">4. Security Responsibilities</h2>
        <p>
          You are responsible for safeguarding access credentials and
          managing access tokens generated through the platform.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">5. Data Integrity</h2>
        <p>
          CordBin implements encryption and distribution mechanisms to
          preserve object integrity but does not guarantee protection
          against misuse outside the platform.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">6. Termination</h2>
        <p>
          Accounts may be suspended for violations of these terms or
          misuse of infrastructure.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl tracking-tight">7. Limitation of Liability</h2>
        <p>
          CordBin is provided as‑is. The operator is not liable for data
          loss, service interruption, or third‑party infrastructure
          disruptions.
        </p>
      </section>

      <p className="font-mono text-xs text-muted-foreground">
        Effective: {new Date().getFullYear()}
      </p>

    </StaticPageLayout>
  );
};

export default Terms;