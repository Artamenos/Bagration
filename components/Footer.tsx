import { MapPin, Phone } from "lucide-react";

const footerNav = [
  { label: "Главная", href: "#hero" },
  { label: "О клубе", href: "#about" },
  { label: "Тренеры", href: "#coaches" },
  { label: "Новости", href: "#news" },
  { label: "Мероприятия", href: "#events" },
  { label: "Альбом", href: "#albums" },
];

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="site-container grid gap-10 py-10 lg:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <a href="#hero" className="inline-flex items-center gap-4">
            <img
              src="/images/logo.png"
              alt="Логотип клуба Багратион"
              className="h-16 w-16 rounded-full object-contain"
            />

            <span className="text-3xl font-bold tracking-wide">Багратион</span>
          </a>

          <p className="mt-5 max-w-[360px] text-lg leading-6 text-white/70">
            Спортивный клуб карате киокушин для детей и взрослых в Москве и Московской области.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold uppercase tracking-[0.08em]">Контакты</h2>

          <div className="mt-5 space-y-4 text-lg text-white/80">
            <a href="tel:+79991234567" className="flex items-center gap-3 transition-colors hover:text-white">
              <Phone size={22} className="text-[var(--color-brand-red)]" />
              +7 (999) 123-45-67
            </a>

            <div className="flex items-start gap-3">
              <MapPin size={22} className="mt-0.5 shrink-0 text-[var(--color-brand-red)]" />
              <span>Москва, ул. Тимирязевская, 16</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold uppercase tracking-[0.08em]">Навигация</h2>

          <nav className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-lg text-white/80">
            {footerNav.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-[var(--color-brand-red)]">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="site-container flex flex-col gap-2 py-5 text-base text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Спортивный клуб «Багратион»</span>
          <span>Пробное занятие - бесплатно</span>
        </div>
      </div>
    </footer>
  );
}
