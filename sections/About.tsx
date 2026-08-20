export function About() {
  return (
    <section id="about" className="bg-[var(--color-brand-bg)] py-14 sm:py-20">
      <div className="site-container grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-[585px_3px_1fr] lg:gap-16">
        <img
          src="/images/club-img.png"
          alt="Спортсмены клуба Багратион"
          className="h-auto w-full rounded-[4px] object-cover"
        />

        <div className="hidden h-[330px] w-[3px] bg-[var(--color-brand-red)] lg:block" />

        <div className="max-w-[620px]">
          <h2 className="text-3xl font-bold uppercase leading-none text-black sm:text-5xl">
            О клубе
          </h2>

          <p className="mt-4 text-base font-light leading-6 text-neutral-800 sm:mt-5 sm:text-2xl sm:leading-[1.28]">
            Клуб «Багратион» — спортивный клуб карате киокушин. Мы развиваем
            техническую подготовку, физическую форму и дисциплину, формируя
            устойчивые навыки и уверенность в себе. Занятия проводятся для
            детей и взрослых с распределением по возрасту и уровню. Подготовка
            включает базовую технику, ОФП, работу в паре, а также подготовку к
            аттестациям и соревнованиям.
          </p>

          <ul className="mt-6 space-y-3 text-center text-base font-light leading-6 text-neutral-800 sm:mt-8 sm:text-xl sm:leading-7 lg:text-left">
            <li className="flex items-center justify-center gap-3 lg:justify-start lg:gap-4">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-red)]" />
              <span>Участие в турнирах — от региональных до чемпионата России</span>
            </li>
            <li className="flex items-center justify-center gap-3 lg:justify-start lg:gap-4">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-red)]" />
              <span>Присвоение спортивных разрядов и мастерских степеней</span>
            </li>
            <li className="flex items-center justify-center gap-3 lg:justify-start lg:gap-4">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-red)]" />
              <span>Летние учебно-тренировочные сборы</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
