export function About() {
  return (
    <section id="about" className="bg-slate-50 py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <img
          src="/images/club-img.png"
          alt="Спортсмены клуба Багратион"
          className="w-full rounded-md object-cover"
        />

        <div>
          <h2 className="text-4xl font-bold uppercase text-black">О клубе</h2>

          <p className="mt-6 text-xl leading-8 text-neutral-800">
            Клуб «Багратион» — спортивный клуб карате киокушин. Мы развиваем
            техническую подготовку, физическую форму и дисциплину, формируя
            устойчивые навыки и уверенность в себе.
          </p>

          <p className="mt-4 text-xl leading-8 text-neutral-800">
            Занятия проходят для детей и взрослых с распределением по возрасту
            и уровню подготовки. Подготовка включает базовую технику, ОФП,
            работу в паре, аттестации и соревнования.
          </p>

          <ul className="mt-6 space-y-3 text-xl text-neutral-800">
            <li>Опыт тренерского состава — 10+ лет</li>
            <li>10+ залов в Москве и Московской области</li>
            <li>Летние учебно-тренировочные сборы</li>
          </ul>
        </div>
      </div>
    </section>
  );
}