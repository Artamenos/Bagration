export function About() {
  return (
    <section id="about" className="bg-[var(--color-brand-bg)] py-20">
      <div className="site-container grid grid-cols-1 items-center gap-12 lg:grid-cols-[585px_3px_1fr] lg:gap-16">
        <img
          src="/images/club-img.png"
          alt="Спортсмены клуба Багратион"
          className="h-auto w-full rounded-[4px] object-cover"
        />

        <div className="hidden h-[330px] w-[3px] bg-[var(--color-brand-red)] lg:block" />

        <div className="max-w-[620px]">
          <h2 className="text-5xl font-bold uppercase leading-none text-black">
            О клубе
          </h2>

          <p className="mt-5 text-2xl font-light leading-[1.28] text-neutral-800">
            Клуб «Багратион» — спортивный клуб карате киокушин. Мы развиваем
            техническую подготовку, физическую форму и дисциплину, формируя
            устойчивые навыки и уверенность в себе. Занятия проводятся для
            детей и взрослых с распределением по возрасту и уровню. Подготовка
            включает базовую технику, ОФП, работу в паре, а также подготовку к
            аттестациям и соревнованиям.
          </p>

          <ul className="mt-8 space-y-3 text-2xl font-light leading-7 text-neutral-800">
            <li className="flex items-center gap-4">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-red)]" />
              <span>Опыт тренерского состава — 10+ лет</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-red)]" />
              <span>10+ залов в Москве и Московской области</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-red)]" />
              <span>Летние учебно-тренировочные сборы</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
