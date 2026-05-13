import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { Why } from "@/components/sections/why";
import { Features } from "@/components/sections/features";
import { Providers } from "@/components/sections/providers";
import { Install } from "@/components/sections/install";
import { Migration } from "@/components/sections/migration";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { SectionDivider } from "@/components/motion/section-divider";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <SectionDivider />
        <Why />
        <SectionDivider />
        <Features />
        <SectionDivider />
        <Providers />
        <SectionDivider />
        <Install />
        <SectionDivider />
        <Migration />
        <SectionDivider />
        <Faq />
        <SectionDivider />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
