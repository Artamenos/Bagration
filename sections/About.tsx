import { Medal, TentTree, Trophy } from "lucide-react";

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
            «Багратион» — клуб карате киокушин для детей и взрослых. Мы развиваем
            техническую подготовку, физическую форму и дисциплину, формируя
            устойчивые навыки и уверенность в себе. Ученики занимаются в группах
            с учетом возраста и уровня подготовки. Программа включает базовую
            технику, ОФП, работу в паре, подготовку к аттестациям и соревнованиям.
          </p>

          <ul className="mx-auto mt-6 max-w-[390px] space-y-3 px-3 text-left text-base font-light leading-6 text-neutral-800 sm:mt-8 sm:max-w-none sm:px-0 sm:text-xl sm:leading-7 lg:mx-0">
            <li className="grid grid-cols-[24px_minmax(0,1fr)] items-start gap-3 lg:gap-4">
              <Trophy className="mt-0.5 h-6 w-6 text-[var(--color-brand-red)]" strokeWidth={2.1} />
              <span>Участие в турнирах — от региональных до чемпионата России</span>
            </li>
            <li className="grid grid-cols-[24px_minmax(0,1fr)] items-start gap-3 lg:gap-4">
              <Medal className="mt-0.5 h-6 w-6 text-[var(--color-brand-blue)]" strokeWidth={2.1} />
              <span>Присвоение спортивных разрядов и мастерских степеней</span>
            </li>
            <li className="grid grid-cols-[24px_minmax(0,1fr)] items-start gap-3 lg:gap-4">
              <TentTree className="mt-0.5 h-6 w-6 text-[var(--color-brand-red)]" strokeWidth={2.1} />
              <span>Летние учебно-тренировочные сборы</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
