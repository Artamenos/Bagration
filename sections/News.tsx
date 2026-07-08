"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

type NewsItem = {
  id: number;
  title: string;
  date: string;
  category: string;
  description: string;
  details: string;
  image: string;
  detailsUrl?: string;
};

const news: NewsItem[] = [
  {
    id: 1,
    title: "Спортсмены клуба выступили на соревнованиях",
    date: "2026-07-04",
    category: "Соревнования",
    description:
      "Команда клуба приняла участие в турнире и показала уверенную технику в нескольких возрастных категориях.",
    details:
      "Для спортсменов это был важный соревновательный опыт: ребята проверили подготовку, получили обратную связь от тренеров и увидели, над чем нужно работать дальше.",
    image: "/images/album.png",
  },
  {
    id: 2,
    title: "Открыт набор в детские и взрослые группы",
    date: "2026-07-08",
    category: "Набор",
    description:
      "Приглашаем новичков на пробное занятие. Тренировки проходят для детей и взрослых с разным уровнем подготовки.",
    details:
      "На первом занятии тренер познакомит с базовыми движениями, расскажет о формате тренировок и поможет подобрать подходящую группу.",
    image: "/images/sign_up.png",
  },
  {
    id: 3,
    title: "Прошла клубная тренировка по базовой технике",
    date: "2026-07-10",
    category: "Тренировки",
    description:
      "На занятии разобрали стойки, перемещения, удары и работу в парах для разных уровней подготовки.",
    details:
      "Такие тренировки помогают выравнивать базу у спортсменов и дают новичкам понятную опору для дальнейшего роста.",
    image: "/images/club-img.png",
  },
  {
    id: 4,
    title: "Фотоальбом с последнего мероприятия уже доступен",
    date: "2026-07-12",
    category: "Фото",
    description:
      "Добавили подборку фотографий с выступлений, тренировок и командных встреч клуба.",
    details:
      "Фотоальбом помогает сохранить атмосферу мероприятий и показать жизнь клуба тем, кто только выбирает секцию.",
    image: "/images/album.png",
    detailsUrl: "https://sc-bagration.ru",
  },
  {
    id: 5,
    title: "Тренеры провели открытую консультацию",
    date: "2026-07-15",
    category: "Клуб",
    description:
      "Родители и спортсмены смогли задать вопросы по тренировочному процессу, аттестациям и участию в стартах.",
    details:
      "Такие встречи помогают лучше понимать цели тренировок и выстраивать понятный план развития спортсмена.",
    image: "/images/hero-team.png",
  },
  {
    id: 6,
    title: "Готовимся к летним учебным сборам",
    date: "2026-07-18",
    category: "Сборы",
    description:
      "В программе сборов техника, физическая подготовка, работа в парах и отдельные занятия по дисциплине.",
    details:
      "Сборы дают спортсменам больше практики за короткий срок и помогают быстрее увидеть слабые места в технике.",
    image: "/images/sign_up.png",
  },
];

function formatNewsDate(date: string) {
  return date.split("-").reverse().join(".");
}

function NewsButton({ item, onOpen }: { item: NewsItem; onOpen: () => void }) {
  const buttonClass =
    "inline-flex h-10 w-fit items-center justify-center gap-2 rounded-[4px] bg-[var(--color-brand-blue)] px-5 text-base font-bold text-white transition-colors hover:bg-[#245ba8]";

  if (item.detailsUrl) {
    return (
      <a
        href={item.detailsUrl}
        target="_blank"
        rel="noreferrer"
        className={buttonClass}
      >
        Подробнее
        <ExternalLink size={18} strokeWidth={2.3} />
      </a>
    );
  }

  return (
    <button type="button" onClick={onOpen} className={buttonClass}>
      Подробнее
      <ExternalLink size={18} strokeWidth={2.3} />
    </button>
  );
}

function NewsModal({
  item,
  onClose,
}: {
  item: NewsItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-6">
      <article className="relative max-h-[90vh] w-full max-w-[760px] overflow-auto rounded-[4px] bg-white p-8 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-[4px] text-black transition-colors hover:bg-[var(--color-brand-bg)]"
          aria-label="Закрыть новость"
        >
          <X size={26} />
        </button>

        <p className="text-lg font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)]">
          {item.category}
        </p>

        <h3 className="mt-3 pr-12 text-4xl font-bold leading-tight text-black">
          {item.title}
        </h3>

        <img
          src={item.image}
          alt={item.title}
          className="mt-6 h-[320px] w-full rounded-[4px] object-cover"
        />

        <div className="mt-6 flex items-center gap-3 text-lg font-medium text-[var(--color-brand-red)]">
          <CalendarDays size={22} />
          {formatNewsDate(item.date)}
        </div>

        <p className="mt-4 text-xl leading-7 text-neutral-800">
          {item.details}
        </p>
      </article>
    </div>
  );
}

export function News() {
  const [openedNews, setOpenedNews] = useState<NewsItem | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  function scrollNews(direction: number) {
    sliderRef.current?.scrollBy({
      left: direction * 340,
      behavior: "smooth",
    });
  }

  return (
    <section id="news" className="bg-white py-16">
      <div className="site-container">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-lg font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)]">
              Жизнь клуба
            </p>

            <h2 className="mt-3 text-5xl font-bold uppercase leading-none text-black">
              Новости
            </h2>
          </div>

          <div className="flex items-end justify-between gap-6 lg:w-[620px]">
            <p className="max-w-[460px] text-xl leading-7 text-neutral-800">
              Компактная лента новостей клуба: соревнования, наборы, тренировки
              и фотоотчеты.
            </p>

            <div className="hidden shrink-0 items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={() => scrollNews(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-neutral-200 text-[var(--color-brand-blue)] transition-colors hover:border-[var(--color-brand-blue)]"
                aria-label="Предыдущие новости"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                type="button"
                onClick={() => scrollNews(1)}
                className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-neutral-200 text-[var(--color-brand-blue)] transition-colors hover:border-[var(--color-brand-blue)]"
                aria-label="Следующие новости"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {news.map((item) => (
            <article
              key={item.id}
              className="flex min-w-[300px] snap-start overflow-hidden rounded-[4px] border border-neutral-200 bg-white shadow-sm lg:min-w-[330px]"
            >
              <div className="flex w-full flex-col">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[170px] w-full object-cover"
                />

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex flex-wrap items-center gap-3 text-base font-medium">
                    <span className="text-[var(--color-brand-blue)]">
                      {item.category}
                    </span>

                    <span className="flex items-center gap-1.5 text-[var(--color-brand-red)]">
                      <CalendarDays size={17} />
                      {formatNewsDate(item.date)}
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-bold leading-tight text-black">
                    {item.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-lg leading-6 text-neutral-800">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-4">
                    <NewsButton item={item} onOpen={() => setOpenedNews(item)} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {openedNews ? (
        <NewsModal item={openedNews} onClose={() => setOpenedNews(null)} />
      ) : null}
    </section>
  );
}
