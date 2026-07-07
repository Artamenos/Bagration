import { Header } from "@/components/Header";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Coaches } from "@/sections/Coaches";
import { Signup } from "@/sections/Signup";
import { Albums } from "@/sections/Albums";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Coaches />
        <Signup />
        <Albums />
      </main>
    </>
  );
}
