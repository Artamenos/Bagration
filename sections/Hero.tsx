import { Phone } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-white">
      <div className="site-container grid min-h-[100svh] place-items-center py-4 md:hidden">
        <div className="flex w-full flex-col items-center">
          <img
            src="/images/hero-team.png"
            alt="Тренеры и спортсмены клуба Багратион"
            className="max-h-[62svh] w-full object-contain object-bottom"
          />

          <h1 className="mt-1 text-center text-5xl font-normal uppercase leading-none tracking-[-0.03em] text-black sm:text-7xl">
            Багратион
          </h1>

          <p className="mt-2 text-center text-base font-light leading-5 text-neutral-700 sm:text-xl">
            Спортивный клуб карате киокушин
          </p>

          <a
            href="tel:+79150590050"
            className="mt-5 inline-flex h-11 items-center justify-center gap-2.5 rounded-[6px] bg-[var(--color-brand-red)] px-7 text-base font-bold text-white transition-colors hover:bg-[#c91920]"
          >
            <Phone size={21} strokeWidth={2.3} />
            Позвонить
          </a>
        </div>
      </div>

      <div className="site-container hidden min-h-[calc(100vh-80px)] max-w-[1400px] grid-cols-1 items-center gap-10 px-8 py-14 md:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <h1 className="-ml-1 text-8xl font-normal uppercase leading-[0.9] tracking-[-0.02em] text-black xl:text-9xl">
            Багратион
          </h1>

          <p className="mt-4 text-2xl font-light leading-none text-neutral-800">
            Спортивный клуб карате киокушин
          </p>

          <p className="mt-4 max-w-140 text-3xl font-light leading-[1.08] text-black">
            Развиваем дисциплину, выносливость и уверенность. Киокушинкай для детей и взрослых.
            Пробное занятие — бесплатно.
          </p>

          <div className="mt-6 flex flex-wrap gap-5">
            <a
              href="#contact"
              className="inline-flex h-[50px] items-center justify-center gap-3 rounded-[6px] bg-[var(--color-brand-red)] px-8 text-xl font-bold text-white transition-colors hover:bg-[#c91920]"
            >
              <Phone size={24} strokeWidth={2.3} />
              Пробная тренировка
            </a>

            <a
              href="tel:+79150590050"
              className="inline-flex h-[50px] items-center justify-center gap-3 rounded-[6px] border-2 border-[var(--color-brand-blue)] px-8 text-xl font-bold text-[var(--color-brand-blue)] transition-colors hover:bg-[var(--color-brand-blue)] hover:text-white"
            >
              <Phone size={24} strokeWidth={2.3} />
              Позвонить
            </a>
          </div>
        </div>

        <div className="relative flex min-h-[520px] items-end justify-center lg:min-h-[620px]">
          <img
            src="/images/hero-team.png"
            alt="Тренеры и спортсмены клуба Багратион"
            className="relative z-10 max-h-[560px] w-auto object-contain lg:max-h-[620px]"
          />
        </div>
      </div>
    </section>
  );
}
