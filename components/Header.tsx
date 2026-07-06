"use client";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Главная", href: "#hero", id: "hero" },
  { label: "О клубе", href: "#about", id: "about" },
  { label: "Новости", href: "#news", id: "news" },
  { label: "Тренеры", href: "#coaches", id: "coaches" },
  { label: "Мероприятия", href: "#events", id: "events" },
];

export function Header() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    function updateActiveSection() {
      const currentSection = navItems.findLast((item) => {
        const section = document.getElementById(item.id);

        if (!section) {
          return false;
        }

        return section.offsetTop <= window.scrollY + 120;
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
    <header className="bg-black text-white">
      <div className="site-container flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-4">
          <img
            src="/images/logo.png"
            alt="Логотип клуба Багратион"
            className="h-14 w-14 rounded-full object-contain"
          />

          <span className="text-3xl font-bold tracking-wide">Багратион</span>
        </a>

        <nav className="hidden items-center gap-10 text-sm font-semibold md:flex">
          {navItems.map((item) => {
            const isActive = item.id === activeSection;

            return (
              <a
                key={item.label}
                href={item.href}
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
