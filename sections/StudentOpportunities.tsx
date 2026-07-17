const opportunities = [
  {
    title: "Пробное занятие",
    description:
      "Первое занятие помогает спокойно познакомиться с клубом: тренер смотрит уровень подготовки, объясняет формат группы и отвечает на организационные вопросы.",
    image: "/images/sign_up.png",
    imageFirst: true,
  },
  {
    title: "Регулярные тренировки",
    description:
      "Основная работа строится на постоянной практике: техника киокушинкай, общая физическая подготовка, координация, дисциплина и работа в парах.",
    image: "/images/club-img.png",
    imageFirst: false,
  },
  {
    title: "Аттестации",
    description:
      "Ученики могут готовиться к аттестациям на пояса. Тренеры помогают разобраться в требованиях и выстроить базовую технику.",
    image: "/images/album.png",
    imageFirst: true,
  },
  {
    title: "Соревнования и сборы",
    description:
      "Клуб участвует в соревнованиях и проводит учебно-тренировочные сборы. Это дополнительная практика, командная среда и опыт выступлений.",
    image: "/images/hero-team.png",
    imageFirst: false,
  },
  {
    title: "Летний лагерь",
    description:
      "Выездной формат с тренировками, режимом и командной средой. Это возможность глубже погрузиться в тренировочный процесс и провести время внутри спортивной атмосферы клуба.",
    image: "/images/album.png",
    imageFirst: true,
  },
];

const summaryItems = [
  {
    title: "знакомство с форматом занятий",
    text: "пробная тренировка и подбор подходящей группы",
  },
  {
    title: "стабильная тренировочная база",
    text: "регулярная техника, ОФП, дисциплина и работа в парах",
  },
  {
    title: "подготовка к аттестациям",
    text: "понятные требования, техника и движение к следующему поясу",
  },
  {
    title: "спортивная жизнь клуба",
    text: "соревнования, командные мероприятия и учебные сборы",
  },
  {
    title: "летний лагерь",
    text: "выездной формат с тренировками, режимом и командной средой",
  },
];

export function StudentOpportunities() {
  return (
    <section className="bg-white py-20">
      <div className="site-container grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="grid grid-cols-1 gap-6">
          {opportunities.map((item) => (
            <article
              key={item.title}
              className="grid h-auto overflow-hidden rounded-[4px] bg-[var(--color-brand-bg)] md:h-[240px] md:grid-cols-2"
            >
              <img
                src={item.image}
                alt={item.title}
                className={[
                  "h-[240px] w-full object-cover md:h-full",
                  item.imageFirst ? "md:order-1" : "md:order-2",
                ].join(" ")}
              />

              <div
                className={[
                  "grid min-h-[240px] grid-rows-[auto_1fr] p-7",
                  item.imageFirst ? "md:order-2" : "md:order-1",
                ].join(" ")}
              >
                <h3 className="self-end text-3xl font-bold leading-tight text-black">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-[390px] text-lg leading-6 text-neutral-800">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="h-fit lg:sticky lg:top-28 lg:self-start">
          <p className="text-lg font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)]">
            Обучение и развитие
          </p>

          <h2 className="mt-3 text-5xl font-bold uppercase leading-none text-black">
            Что получает ученик
          </h2>

          <p className="mt-5 max-w-[560px] text-xl leading-7 text-neutral-800">
            Клуб даёт не только регулярные тренировки. У учеников есть среда,
            где можно привыкнуть к занятиям, укреплять базу, готовиться к
            аттестациям и участвовать в спортивной жизни клуба.
          </p>

          <div className="mt-10 grid max-w-[560px] grid-cols-1 gap-5">
            {summaryItems.map((item, index) => (
              <article key={item.title} className="relative grid grid-cols-[42px_1fr] gap-5">
                {index < summaryItems.length - 1 ? (
                  <span className="absolute left-[20px] top-10 h-[calc(100%+20px)] w-[2px] bg-black/80" />
                ) : null}

                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white">
                  <span className="text-lg font-bold leading-none text-black">
                    {index + 1}
                  </span>
                  <span
                    className={[
                      "absolute -right-1 -top-1 h-3 w-3 rounded-full",
                      index % 2 === 0
                        ? "bg-[var(--color-brand-red)]"
                        : "bg-[var(--color-brand-blue)]",
                    ].join(" ")}
                  />
                </div>

                <div className="pb-2">
                  <p className="text-xl font-bold leading-6 text-black">
                    {item.title}
                  </p>

                  <p className="mt-1 text-base leading-6 text-neutral-700">
                    {item.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
