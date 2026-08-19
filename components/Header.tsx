"use client";

import { type MouseEvent, useEffect, useState } from "react";

const navItems = [
  { label: "Главная", href: "#hero", id: "hero" },
  { label: "Новости", href: "#news", id: "news" },
  { label: "О клубе", href: "#about", id: "about" },
  { label: "Тренеры", href: "#coaches", id: "coaches" },
  { label: "Мероприятия", href: "#events", id: "events" },
  { label: "Альбом", href: "#albums", id: "albums" },
];

export function Header() {
  const [activeSection, setActiveSection] = useState("hero");

  function scrollToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    const section = document.getElementById(id);

    if (!section) {
      return;
    }

    event.preventDefault();
    section.scrollIntoView({ behavior: "smooth", block: "center" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveSection(id);
  }

  useEffect(() => {
    function updateActiveSection() {
      const activationLine = window.innerHeight * 0.35;
      const isAtPageBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;

      if (isAtPageBottom) {
        setActiveSection(navItems.at(-1)?.id ?? "hero");
        return;
      }

      const currentSection = navItems.findLast((item) => {
        const section = document.getElementById(item.id);

        if (!section) {
          return false;
        }

        return section.getBoundingClientRect().top <= activationLine;
      });

      setActiveSection(currentSection?.id ?? "hero");
    }

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, []);

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-black text-white">
      <div className="site-container flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="#hero" onClick={(event) => scrollToSection(event, "hero")} className="flex items-center gap-4">
          <img
            src="/images/logo.png"
            alt="Логотип клуба Багратион"
            className="h-20 w-20 rounded-full object-contain"
          />

          <span className="text-4xl font-bold tracking-wide">Багратион</span>
        </a>

        <nav className="hidden items-center gap-8 text-lg font-medium md:flex">
          {navItems.map((item) => {
            const isActive = item.id === activeSection;

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(event) => scrollToSection(event, item.id)}
                className={
                  isActive
                    ? "border-b-2 border-[var(--color-brand-red)] pb-2 text-[var(--color-brand-red)]"
                    : "border-b-2 border-transparent pb-2 text-white transition-colors hover:text-[var(--color-brand-red)]"
                }
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
