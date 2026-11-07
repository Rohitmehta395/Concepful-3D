import { Build } from "@/components/story/Build";
import { Classes } from "@/components/story/Classes";
import { Hero } from "@/components/story/Hero";
import { Logistics } from "@/components/story/Logistics";
import { Outro } from "@/components/story/Outro";
import { Plans } from "@/components/story/Plans";
import { Rules } from "@/components/story/Rules";

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="story outline-none">
      <Hero />
      <Classes />
      <Logistics />
      <Rules />
      <Plans />
      <Outro />
      <Build />
    </main>
  );
}
