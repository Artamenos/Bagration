import { Header } from "@/components/Header";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
      </main>
    </>
  );
}
