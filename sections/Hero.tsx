export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-white">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1400px] grid-cols-1 items-center gap-16 px-8 py-14 lg:grid-cols-[0.9fr_1.1fr]">        <div>
          <h1 className="text-[104px] font-normal uppercase leading-[0.95] tracking-[-0.02em] text-black">
            Багратион
          </h1>

          <p className="mt-4 text-[25px] font-light leading-none text-neutral-800">
            Спортивный клуб карате киокушин
          </p>

          <p className="mt-6 max-w-[610px] text-[31px] font-normal leading-[1.08] text-black">
            Развиваем дисциплину, выносливость и уверенность.
            Киокушинкай для детей и взрослых.
            Пробное занятие — бесплатно.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">
            <a
              href="#signup"
              className="inline-flex h-[50px] items-center justify-center rounded-[6px] bg-red-600 px-8 text-[21px] font-bold text-white transition-colors hover:bg-red-700"
            >
              Записаться
            </a>

            <a
              href="tel:+79991234567"
              className="inline-flex h-[50px] items-center justify-center rounded-[6px] border-2 border-blue-600 px-8 text-[21px] font-bold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
            >
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