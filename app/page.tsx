import { Header } from "@/components/Header";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Coaches } from "@/sections/Coaches";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Coaches />
      </main>
    </>
  );
}
