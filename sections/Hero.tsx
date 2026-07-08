import { CalendarDays, Phone } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-white">
      <div className="site-container grid min-h-[calc(100vh-80px)] max-w-[1400px] grid-cols-1 items-center gap-16 px-8 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h1 className="-ml-1 text-9xl font-normal uppercase leading-[0.9] tracking-[-0.02em] text-black">
            Багратион
          </h1>

          <p className="mt-4 text-2xl font-light leading-none text-neutral-800">
            Спортивный клуб карате киокушин
          </p>

          <p className="mt-4 max-w-140 text-3xl font-light leading-[1.08] text-black">
            Развиваем дисциплину, выносливость и уверенность.
            Киокушинкай для детей и взрослых.
            Пробное занятие — бесплатно.
          </p>

          <div className="mt-6 flex flex-wrap gap-5">
            <a
              href="#signup"
              className="inline-flex h-[50px] items-center justify-center gap-3 rounded-[6px] bg-[var(--color-brand-red)] px-8 text-xl font-bold text-white transition-colors hover:bg-[#c91920]"
            >
              <CalendarDays size={24} strokeWidth={2.3} />
              Записаться
            </a>

            <a
              href="tel:+79991234567"
              className="inline-flex h-[50px] items-center justify-center gap-3 rounded-[6px] border-2 border-[var(--color-brand-blue)] px-8 text-xl font-bold text-[var(--color-brand-blue)] transition-colors hover:bg-[var(--color-brand-blue)] hover:text-white"
            >
              <Phone size={24} strokeWidth={2.3} />
              Позвонить
            </a>
          </div>
        </div>

        <div className="relative flex min-h-[620px] items-end justify-center">
          <img
            src="/images/hero-team.png"
            alt="Тренеры и спортсмены клуба Багратион"
            className="relative z-10 max-h-[620px] w-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
