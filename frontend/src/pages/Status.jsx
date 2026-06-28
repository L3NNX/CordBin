import StaticPageLayout from "../components/layout/StaticPageLayout";

const Status = () => {
  return (
    <StaticPageLayout
      eyebrow="Status"
      title="System operational status"
    >

      {/* Current Status */}
      <section className="space-y-6">
        <h2 className="text-xl tracking-tight">Current System State</h2>

        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between">
            <span>Encrypted Storage Layer</span>
            <span className="text-emerald-500">Operational</span>
          </div>

          <div className="flex justify-between">
            <span>Metadata Registry</span>
            <span className="text-emerald-500">Operational</span>
          </div>

          <div className="flex justify-between">
            <span>Rate Limit Manager</span>
            <span className="text-emerald-500">Monitoring</span>
          </div>

          <div className="flex justify-between">
            <span>Discord API Dependency</span>
            <span className="text-emerald-500">Operational</span>
          </div>
        </div>
      </section>

      {/* Dependency Notice */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">Infrastructure Dependencies</h2>
        <p>
          CordBin depends on Discord’s API and content delivery network for
          object storage. Service availability may be affected by upstream
          infrastructure conditions.
        </p>
      </section>

      {/* Incident History */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">Recent Incidents</h2>
        <p className="text-muted-foreground">
          No incidents reported.
        </p>
      </section>

      {/* Uptime */}
      <section className="space-y-5">
        <h2 className="text-xl tracking-tight">Uptime</h2>
        <p>
          Monitoring and infrastructure metrics are continuously observed to
          maintain stability and compliance.
        </p>
      </section>

      <p className="font-mono text-xs text-muted-foreground">
        Last updated: {new Date().toLocaleString()}
      </p>

    </StaticPageLayout>
  );
};

export default Status;