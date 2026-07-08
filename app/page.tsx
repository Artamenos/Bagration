import { Header } from "@/components/Header";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { News } from "@/sections/News";
import { Coaches } from "@/sections/Coaches";
import { StudentOpportunities } from "@/sections/StudentOpportunities";
import { Signup } from "@/sections/Signup";
import { Albums } from "@/sections/Albums";
import { Events } from "@/sections/Events";

export default function Home() {
  return (
    <>
      <Header />
      <main className="landing-flow">
        <Hero />
        <About />
        <Coaches />
        <StudentOpportunities />
        <Signup />
        <News />
        <Events />
        <Albums />
      </main>
    </>
  );
}
