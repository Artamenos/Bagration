import { Phone } from "lucide-react";

export function ContactCall() {
  return (
    <section id="contact" className="bg-white py-14 sm:py-20">
      <div className="site-container">
        <div className="mx-auto grid max-w-[1080px] overflow-hidden rounded-[6px] border border-neutral-200 bg-[var(--color-brand-bg)] shadow-sm md:grid-cols-[minmax(280px,420px)_1fr]">
          <img
            src="/images/sign_up.png"
            alt="Спортсмены клуба «Багратион» на соревнованиях"
            className="h-52 w-full object-cover sm:h-64 md:h-full"
          />

          <div className="flex flex-col justify-center px-5 py-8 sm:px-10 sm:py-10 md:py-12">
            <p className="text-base font-bold uppercase tracking-[0.12em] text-[var(--color-brand-blue)]">
              Пробное занятие бесплатно
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-black sm:text-4xl">
              Хотите прийти на пробную тренировку?
            </h2>
            <p className="mt-4 max-w-[560px] text-base leading-6 text-neutral-700 sm:text-lg sm:leading-7">
              Позвоните нам — подберём тренера, зал и удобное время.
            </p>

            <a
              href="tel:+79150590050"
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[6px] bg-[var(--color-brand-red)] px-5 text-base font-bold text-white transition-colors hover:bg-[#c91920] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand-blue)] sm:w-fit sm:px-7 sm:text-lg"
              aria-label="Позвонить в клуб Багратион по номеру плюс семь девятьсот пятнадцать ноль пятьдесят девять ноль ноль пятьдесят"
            >
              <Phone size={22} strokeWidth={2.3} />
              +7 (915) 059-00-50
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
