import { Award, CalendarCheck, Dumbbell, Medal, Tent } from "lucide-react";

type OpportunityIcon = "trial" | "training" | "exam" | "competition" | "camp";

type Opportunity = {
  title: string;
  description: string;
  icon: OpportunityIcon;
  imageFirst: boolean;
};

const opportunities: Opportunity[] = [
  {
    title: "Пробное занятие",
    description:
      "Первое занятие помогает спокойно познакомиться с клубом: тренер смотрит уровень подготовки, объясняет формат группы и отвечает на организационные вопросы.",
    icon: "trial",
    imageFirst: true,
  },
  {
    title: "Регулярные тренировки",
    description:
      "Основная работа строится на постоянной практике: техника киокушинкай, общая физическая подготовка, координация, дисциплина и работа в парах.",
    icon: "training",
    imageFirst: false,
  },
  {
    title: "Аттестации",
    description:
      "Ученики могут готовиться к аттестациям на пояса. Тренеры помогают разобраться в требованиях и выстроить базовую технику.",
    icon: "exam",
    imageFirst: true,
  },
  {
    title: "Соревнования и сборы",
    description:
      "Клуб участвует в соревнованиях и проводит учебно-тренировочные сборы. Это дополнительная практика, командная среда и опыт выступлений.",
    icon: "competition",
    imageFirst: false,
  },
  {
    title: "Летний лагерь",
    description:
      "Выездной формат с тренировками, режимом и командной средой. Это возможность глубже погрузиться в тренировочный процесс и провести время внутри спортивной атмосферы клуба.",
    icon: "camp",
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

const opportunityIcons = {
  trial: CalendarCheck,
  training: Dumbbell,
  exam: Award,
  competition: Medal,
  camp: Tent,
};

function OpportunityVisual({
  icon,
  hasBackground,
  number,
}: {
  icon: OpportunityIcon;
  hasBackground: boolean;
  number: number;
}) {
  const Icon = opportunityIcons[icon];

  return (
    <div
      className={[
        "relative flex h-[160px] w-full items-center justify-center sm:h-[200px] md:h-full",
        hasBackground ? "bg-[var(--color-brand-bg)]" : "bg-white",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-4 text-5xl font-bold leading-none opacity-10 sm:top-5 sm:text-6xl",
          number % 2 === 0 ? "text-[var(--color-brand-red)]" : "text-[var(--color-brand-blue)]",
          number % 2 === 0 ? "right-5" : "left-5",
        ].join(" ")}
      >
        0{number}
      </span>

      <Icon
        size={82}
        strokeWidth={1.8}
        className={[
          "relative z-10",
          number % 2 === 0 ? "text-[var(--color-brand-red)]" : "text-[var(--color-brand-blue)]",
          number % 2 === 0 ? "-translate-x-3" : "translate-x-3",
        ].join(" ")}
      />
    </div>
  );
}

export function StudentOpportunities() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="site-container grid grid-cols-1 gap-12 sm:gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="order-2 grid grid-cols-1 gap-6 lg:order-1">
          {opportunities.map((item, index) => {
            const hasBackground = index % 2 === 0;

            return (
            <div
              key={item.title}
              className={[
                "relative",
                hasBackground
                  ? "before:pointer-events-none before:absolute before:inset-y-0 before:left-1/2 before:w-screen before:-translate-x-1/2 before:bg-[var(--color-brand-bg)] before:content-[''] md:before:hidden"
                  : "",
              ].join(" ")}
            >
            <article
              className={[
                "relative grid h-auto overflow-hidden rounded-[4px] md:h-[240px]",
                item.imageFirst
                  ? "md:grid-cols-[0.72fr_1.28fr]"
                  : "md:grid-cols-[1.28fr_0.72fr]",
                hasBackground ? "bg-[var(--color-brand-bg)]" : "bg-white",
              ].join(" ")}
            >
              <div className={item.imageFirst ? "md:order-1" : "md:order-2"}>
                <OpportunityVisual icon={item.icon} hasBackground={hasBackground} number={index + 1} />
              </div>

              <div
                className={[
                  "relative flex min-h-0 flex-col justify-center px-5 py-7 sm:min-h-[220px] sm:pl-7 sm:pr-9 md:min-h-[240px]",
                  item.imageFirst ? "md:order-2" : "md:order-1",
                ].join(" ")}
              >
                <span
                  className={[
                    "absolute left-5 top-1/2 h-[72px] w-[4px] -translate-y-1/2 sm:left-7 sm:h-[86px]",
                    (index + 1) % 2 === 0 ? "bg-[var(--color-brand-red)]" : "bg-[var(--color-brand-blue)]",
                  ].join(" ")}
                />

                <h3 className="pl-5 text-2xl font-bold leading-tight text-black sm:pl-6 sm:text-3xl">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-none pl-5 text-base leading-6 text-neutral-800 sm:pl-8 sm:text-lg">
                  {item.description}
                </p>
              </div>
            </article>
            </div>
            );
          })}
        </div>

        <div className="order-1 h-fit lg:order-2 lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)] sm:text-lg">
            Обучение и развитие
          </p>

          <h2 className="mt-2 text-3xl font-bold uppercase leading-none text-black sm:mt-3 sm:text-5xl">
            Что получает ученик
          </h2>

          <p className="mt-4 max-w-[560px] text-base leading-6 text-neutral-800 sm:mt-5 sm:text-xl sm:leading-7">
            Клуб дает не только регулярные тренировки. У учеников есть среда, где можно привыкнуть к занятиям, укреплять базу, готовиться к аттестациям и участвовать в спортивной жизни клуба.
          </p>

          <div className="mt-10 hidden max-w-[560px] grid-cols-1 gap-5 lg:grid">
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
                        ? "bg-[var(--color-brand-blue)]"
                        : "bg-[var(--color-brand-red)]",
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
