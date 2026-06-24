import StaticPageLayout from "../components/layout/StaticPageLayout";

const About = () => {
  return (
    <StaticPageLayout
      eyebrow="About"
      title="An encrypted object layer built out of curiosity"
    >

      <section className="space-y-6">
        <p>
          CordBin started as an experiment: could Discord’s infrastructure be
          abstracted into a usable encrypted object storage layer?
        </p>

        <p>
          Instead of building another file hosting service, the goal was to
          design a controlled, encrypted distribution engine that respects
          rate limits, abstracts infrastructure constraints, and keeps data
          encrypted at every stage.
        </p>

        <p>
          This is not a venture-backed platform. It is a focused engineering
          project exploring distributed storage mechanics, encryption design,
          and API compliance under real-world constraints.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl tracking-tight">Principles</h2>

        <ul className="space-y-3 text-muted-foreground">
          <li>• Encrypt first. Always.</li>
          <li>• Abstract infrastructure limits responsibly.</li>
          <li>• Design for failure and recovery.</li>
          <li>• Prefer control over convenience.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl tracking-tight">Why Discord?</h2>

        <p>
          Discord provides a globally distributed content delivery layer with
          predictable API behavior. The challenge was not storing files — it
          was orchestrating compliance, chunking, and metadata integrity.
        </p>

        <p>
          CordBin is an exploration of how far disciplined orchestration can
          stretch an existing platform into something structured and reliable.
        </p>
      </section>

    </StaticPageLayout>
  );
};

export default About;