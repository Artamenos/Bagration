"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import { useState } from "react";

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
];

function formatNewsDate(date: string) {
  return date.split("-").reverse().join(".");
}

function getWrappedIndex(index: number) {
  return (index + news.length) % news.length;
}

function SideNewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="hidden h-[300px] overflow-hidden rounded-[4px] border border-neutral-200 bg-white opacity-35 shadow-sm lg:block">
      <img src={item.image} alt={item.title} className="h-[175px] w-full object-cover" />

      <div className="p-5">
        <p className="text-base font-medium text-[var(--color-brand-blue)]">
          {item.category}
        </p>

        <h3 className="mt-2 line-clamp-2 text-2xl font-bold leading-tight text-black">
          {item.title}
        </h3>
      </div>
    </article>
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [openedNews, setOpenedNews] = useState<NewsItem | null>(null);

  const activeNews = news[activeIndex];
  const previousNews = news[getWrappedIndex(activeIndex - 1)];
  const nextNews = news[getWrappedIndex(activeIndex + 1)];

  function showPreviousNews() {
    setActiveIndex((currentIndex) => getWrappedIndex(currentIndex - 1));
  }

  function showNextNews() {
    setActiveIndex((currentIndex) => getWrappedIndex(currentIndex + 1));
  }

  return (
    <section id="news" className="bg-white pb-20 pt-4">
      <div className="site-container">
        <div className="grid min-h-[350px] grid-cols-[1fr_56px_minmax(0,980px)_56px_1fr] items-center gap-5">
          <SideNewsCard item={previousNews} />

          <button
            type="button"
            onClick={showPreviousNews}
            className="z-20 flex h-12 w-12 items-center justify-center rounded-[4px] border border-neutral-200 bg-white text-[var(--color-brand-blue)] shadow-sm transition-colors hover:border-[var(--color-brand-blue)]"
            aria-label="Предыдущая новость"
          >
            <ChevronLeft size={28} />
          </button>

          <article className="relative z-10 col-span-3 grid h-[310px] w-full overflow-hidden rounded-[4px] border border-neutral-200 bg-white shadow-sm lg:col-span-1 lg:grid-cols-[470px_1fr]">
            <img
              src={activeNews.image}
              alt={activeNews.title}
              className="h-[240px] w-full object-cover lg:h-full"
            />

            <div className="grid h-full grid-rows-[auto_auto_1fr_auto] p-5">
              <div className="flex flex-wrap items-center gap-4 text-base font-medium">
                <span className="text-[var(--color-brand-blue)]">
                  {activeNews.category}
                </span>

                <span className="flex items-center gap-2 text-neutral-500">
                  <CalendarDays size={17} />
                  {formatNewsDate(activeNews.date)}
                </span>
              </div>

              <h3 className="mt-3 line-clamp-2 text-3xl font-bold leading-tight text-black">
                {activeNews.title}
              </h3>

              <p className="mt-3 line-clamp-2 text-lg leading-6 text-neutral-800">
                {activeNews.description}
              </p>

              <div className="self-end pt-4">
                {activeNews.detailsUrl ? (
                  <a
                    href={activeNews.detailsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-lg font-bold text-[var(--color-brand-blue)] transition-colors hover:text-[#245ba8]"
                  >
                    Читать
                    <ExternalLink size={19} strokeWidth={2.3} />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOpenedNews(activeNews)}
                    className="inline-flex items-center gap-2 text-lg font-bold text-[var(--color-brand-blue)] transition-colors hover:text-[#245ba8]"
                  >
                    Читать
                    <ExternalLink size={19} strokeWidth={2.3} />
                  </button>
                )}
              </div>
            </div>
          </article>

          <button
            type="button"
            onClick={showNextNews}
            className="z-20 flex h-12 w-12 items-center justify-center rounded-[4px] border border-neutral-200 bg-white text-[var(--color-brand-blue)] shadow-sm transition-colors hover:border-[var(--color-brand-blue)]"
            aria-label="Следующая новость"
          >
            <ChevronRight size={28} />
          </button>

          <SideNewsCard item={nextNews} />
        </div>

        <div className="mt-2 flex justify-center gap-2">
          {news.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={[
                "h-2.5 rounded-full transition-all",
                index === activeIndex
                  ? "w-8 bg-[var(--color-brand-red)]"
                  : "w-2.5 bg-neutral-300 hover:bg-[var(--color-brand-blue)]",
              ].join(" ")}
              aria-label={`Открыть новость ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {openedNews ? (
        <NewsModal item={openedNews} onClose={() => setOpenedNews(null)} />
      ) : null}
    </section>
  );
}
