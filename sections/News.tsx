"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

function MobileNewsCard({
  item,
  onOpen,
}: {
  item: NewsItem;
  onOpen: (item: NewsItem) => void;
}) {
  return (
    <article className="flex min-h-[430px] w-[84vw] max-w-[360px] shrink-0 snap-center flex-col overflow-hidden rounded-[4px] border border-neutral-200 bg-white shadow-sm">
      <img src={item.image} alt={item.title} className="h-[230px] w-full object-cover" />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <span className="text-[var(--color-brand-blue)]">{item.category}</span>
          <span className="flex items-center gap-1.5 text-neutral-500">
            <CalendarDays size={15} />
            {formatNewsDate(item.date)}
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-xl font-bold leading-tight text-black">
          {item.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-5 text-neutral-700">
          {item.description}
        </p>

        <div className="mt-auto pt-3">
          {item.detailsUrl ? (
            <a
              href={item.detailsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center gap-2 font-bold text-[var(--color-brand-blue)]"
            >
              Читать
              <ExternalLink size={18} strokeWidth={2.3} />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="inline-flex min-h-10 items-center gap-2 font-bold text-[var(--color-brand-blue)]"
            >
              Читать
              <ExternalLink size={18} strokeWidth={2.3} />
            </button>
          )}
        </div>
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-3 sm:px-6">
      <article className="relative max-h-[94dvh] w-full max-w-[760px] overflow-auto rounded-[4px] bg-white p-5 shadow-xl sm:max-h-[90vh] sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-[4px] bg-white text-black shadow-sm transition-colors hover:bg-[var(--color-brand-bg)] sm:right-5 sm:top-5"
          aria-label="Закрыть новость"
        >
          <X size={26} />
        </button>

        <p className="pr-12 text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)] sm:text-lg">
          {item.category}
        </p>

        <h3 className="mt-3 pr-12 text-2xl font-bold leading-tight text-black sm:text-4xl">
          {item.title}
        </h3>

        <img
          src={item.image}
          alt={item.title}
          className="mt-5 h-[190px] w-full rounded-[4px] object-cover sm:mt-6 sm:h-[320px]"
        />

        <div className="mt-5 flex items-center gap-3 text-base font-medium text-[var(--color-brand-red)] sm:mt-6 sm:text-lg">
          <CalendarDays size={22} />
          {formatNewsDate(item.date)}
        </div>

        <p className="mt-4 text-base leading-6 text-neutral-800 sm:text-xl sm:leading-7">
          {item.details}
        </p>
      </article>
    </div>
  );
}

export function News() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openedNews, setOpenedNews] = useState<NewsItem | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeNews = news[activeIndex];
  const previousNews = news[getWrappedIndex(activeIndex - 1)];
  const nextNews = news[getWrappedIndex(activeIndex + 1)];

  function scrollMobileToIndex(index: number, behavior: ScrollBehavior = "smooth") {
    const track = mobileTrackRef.current;
    const card = track?.children.item(index) as HTMLElement | null;

    if (!track || !card) {
      return;
    }

    const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    track.scrollTo({ left, behavior });
  }

  function selectNews(index: number) {
    activeIndexRef.current = index;
    setActiveIndex(index);
    scrollMobileToIndex(index);
  }

  useEffect(() => {
    if (openedNews) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const nextIndex = getWrappedIndex(activeIndexRef.current + 1);

      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      scrollMobileToIndex(nextIndex);
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [openedNews]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  function handleMobileScroll() {
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = setTimeout(() => {
      const track = mobileTrackRef.current;

      if (!track) {
        return;
      }

      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      Array.from(track.children).forEach((child, index) => {
        const card = child as HTMLElement;
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - trackCenter);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      activeIndexRef.current = nearestIndex;
      setActiveIndex(nearestIndex);
    }, 100);
  }

  function showPreviousNews() {
    setActiveIndex((currentIndex) => {
      const nextIndex = getWrappedIndex(currentIndex - 1);
      activeIndexRef.current = nextIndex;
      return nextIndex;
    });
  }

  function showNextNews() {
    setActiveIndex((currentIndex) => {
      const nextIndex = getWrappedIndex(currentIndex + 1);
      activeIndexRef.current = nextIndex;
      return nextIndex;
    });
  }

  return (
    <section id="news" className="bg-white pb-14 pt-2 sm:pb-20 sm:pt-4">
      <div className="site-container">
        <div
          ref={mobileTrackRef}
          onScroll={handleMobileScroll}
          className="scrollbar-hidden -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[8vw] pb-2 lg:hidden"
          aria-label="Новости клуба. Проведите пальцем влево или вправо"
        >
          {news.map((item) => (
            <MobileNewsCard key={item.id} item={item} onOpen={setOpenedNews} />
          ))}
        </div>

        <div className="relative hidden min-h-[350px] grid-cols-[1fr_56px_minmax(0,980px)_56px_1fr] items-center gap-5 lg:grid">
          <SideNewsCard item={previousNews} />

          <button
            type="button"
            onClick={showPreviousNews}
            className="absolute left-2 top-[65px] z-20 flex h-10 w-10 items-center justify-center rounded-[4px] border border-neutral-200 bg-white/95 text-[var(--color-brand-blue)] shadow-sm transition-colors hover:border-[var(--color-brand-blue)] sm:top-[88px] sm:h-12 sm:w-12 lg:static"
            aria-label="Предыдущая новость"
          >
            <ChevronLeft size={28} />
          </button>

          <article className="relative z-10 flex h-auto min-h-[430px] w-full flex-col overflow-hidden rounded-[4px] border border-neutral-200 bg-white shadow-sm sm:min-h-[460px] lg:h-[310px] lg:min-h-0 lg:flex-row">
            <img
              src={activeNews.image}
              alt={activeNews.title}
              className="h-[170px] w-full flex-none object-cover sm:h-[220px] lg:h-full lg:w-[470px]"
            />

            <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium sm:gap-4 sm:text-base">
                <span className="text-[var(--color-brand-blue)]">
                  {activeNews.category}
                </span>

                <span className="flex items-center gap-2 text-neutral-500">
                  <CalendarDays size={17} />
                  {formatNewsDate(activeNews.date)}
                </span>
              </div>

              <h3 className="mt-3 line-clamp-3 text-xl font-bold leading-tight text-black sm:text-3xl lg:line-clamp-2">
                {activeNews.title}
              </h3>

              <p className="mt-3 line-clamp-3 text-sm leading-5 text-neutral-800 sm:text-lg sm:leading-6 lg:line-clamp-2">
                {activeNews.description}
              </p>

              <div className="mt-auto pt-4">
                {activeNews.detailsUrl ? (
                  <a
                    href={activeNews.detailsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 text-base font-bold text-[var(--color-brand-blue)] transition-colors hover:text-[#245ba8] sm:text-lg"
                  >
                    Читать
                    <ExternalLink size={19} strokeWidth={2.3} />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOpenedNews(activeNews)}
                    className="inline-flex min-h-10 items-center gap-2 text-base font-bold text-[var(--color-brand-blue)] transition-colors hover:text-[#245ba8] sm:text-lg"
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
            className="absolute right-2 top-[65px] z-20 flex h-10 w-10 items-center justify-center rounded-[4px] border border-neutral-200 bg-white/95 text-[var(--color-brand-blue)] shadow-sm transition-colors hover:border-[var(--color-brand-blue)] sm:top-[88px] sm:h-12 sm:w-12 lg:static"
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
              onClick={() => selectNews(index)}
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
