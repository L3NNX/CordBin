// pages/Landing.tsx
import Navbar from "../components/layout/Navbar";
import Hero from "../components/layout/Hero";
import Features from "../components/layout/Features";
import Pricing from "../components/layout/Pricing";
import FAQ from "../components/layout/FAQ";
import Footer from "../components/layout/Footer";
import Testimonials from "../components/layout/Testimonials";
import HowItWorks from "../components/layout/HowItWorks";

const Landing = () => {
  return (
    <>
      <Navbar />

      <main className="bg-[#f5f5f5]">

        {/* HERO */}
        <section className="w-full px-3 sm:px-6 lg:px-8">
          <div className="h-10 mx-auto max-w-[1720px] border border-y border-border bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.03)_0_2px,transparent_2px_10px)]" />
          <div className="mx-auto max-w-[1720px] border-x border-border">
            <Hero />
          </div>
        </section>

        {/* FEATURES */}
        <section className="w-full px-3 sm:px-6 lg:px-8">
          <div className="h-10 mx-auto max-w-[1720px] border border-y border-border bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.03)_0_2px,transparent_2px_10px)]" />
          <div className="mx-auto max-w-[1720px] border-x border-border">
            <Features />
          </div>
        </section>

                {/* FEATURES */}
        <section className="w-full px-3 sm:px-6 lg:px-8">
          <div className="h-10 mx-auto max-w-[1720px] border border-y border-border bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.03)_0_2px,transparent_2px_10px)]" />
          <div className="mx-auto max-w-[1720px] border-x border-border">
            <HowItWorks />
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full px-3 sm:px-6 lg:px-8">
          <div className="h-10 mx-auto max-w-[1720px] border border-y border-border bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.03)_0_2px,transparent_2px_10px)]" />
          <div className="mx-auto max-w-[1720px] border-x border-border">
            <Testimonials />
          </div>
        </section>

        {/* PRICING */}
        <section className="w-full px-3 sm:px-6 lg:px-8">
          <div className="h-10 mx-auto max-w-[1720px] border border-y border-border bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.03)_0_2px,transparent_2px_10px)]" />
          <div className="mx-auto max-w-[1720px] border-x border-border">
            <Pricing />
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full px-3 sm:px-6 lg:px-8">
          <div className="h-10 mx-auto max-w-[1720px] border border-y border-border bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.03)_0_2px,transparent_2px_10px)]" />
          <div className="mx-auto max-w-[1720px] border-x border-border">
            <FAQ />
          </div>
        </section>

             {/* Final Bottom Hatch (same padding wrapper as other strips) */}
        <section className="w-full px-3 sm:px-6 lg:px-8">
          <div className="mx-auto h-20 w-full max-w-[1720px] border border-y border-border bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.03)_0_2px,transparent_2px_10px)]" />
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Landing;