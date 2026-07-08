"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type EventItem = {
  id: number;
  title: string;
  city: string;
  description: string;
  details: string;
  image: string;
  startDate: string;
  endDate?: string;
  detailsUrl?: string;
};

type CalendarDay = {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
};

const events: EventItem[] = [
  {
    id: 1,
    title: "Открытая тренировка клуба",
    city: "Москва",
    description:
      "Тренировка для новичков и действующих спортсменов. Разбор базовой техники, работа в парах и ответы на вопросы родителей.",
    details:
      "На тренировке тренеры покажут базовые стойки, удары и элементы общей физической подготовки. Можно прийти без экипировки, главное — удобная спортивная форма.",
    image: "/images/sign_up.png",
    startDate: "2026-07-12",
  },
  {
    id: 2,
    title: "Учебно-тренировочные сборы",
    city: "Московская область",
    description:
      "Интенсивные занятия по технике, физической подготовке и подготовке к аттестациям.",
    details:
      "Сборы проходят несколько дней подряд. В программе: техника кихон, работа в парах, растяжка, силовая подготовка и отдельные занятия по подготовке к аттестации.",
    image: "/images/club-img.png",
    startDate: "2026-07-18",
    endDate: "2026-07-20",
  },
  {
    id: 3,
    title: "Кубок Багратиона",
    city: "Москва",
    description:
      "Внутриклубные соревнования для детских и взрослых групп с участием тренерского состава.",
    details:
      "Соревнования помогут спортсменам получить первый соревновательный опыт, проверить технику и научиться спокойно работать в стрессовой ситуации.",
    image: "/images/album.png",
    startDate: "2026-08-03",
    detailsUrl: "https://sc-bagration.ru",
  },
];

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMondayBasedDay(date: Date) {
  const day = date.getDay();

  return day === 0 ? 6 : day - 1;
}

function getCalendarDays(monthDate: Date): CalendarDay[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = getMondayBasedDay(firstDay);
  const calendarStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);

    return {
      date,
      dateKey: toDateKey(date),
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
    };
  });
}

function isDateInsideEvent(dateKey: string, event: EventItem) {
  return dateKey >= event.startDate && dateKey <= (event.endDate ?? event.startDate);
}

function getEventDateText(event: EventItem) {
  const start = event.startDate.split("-").reverse().join(".");

  if (!event.endDate || event.endDate === event.startDate) {
    return start;
  }

  const end = event.endDate.split("-").reverse().join(".");

  return `${start} - ${end}`;
}

export function Events() {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(new Date()));
  const [openedEvent, setOpenedEvent] = useState<EventItem | null>(null);

  const calendarDays = useMemo(
    () => getCalendarDays(visibleMonth),
    [visibleMonth],
  );

  const selectedEvent = events.find((event) =>
    isDateInsideEvent(selectedDateKey, event),
  );

  function changeMonth(direction: number) {
    setVisibleMonth((currentMonth) => {
      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(currentMonth.getMonth() + direction);

      return nextMonth;
    });
  }

  return (
    <section id="events" className="bg-white py-20">
      <div className="site-container">
        <div className="mb-6 text-center">
          <p className="text-lg font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)]">
            Календарь клуба
          </p>

          <h2 className="mt-3 text-5xl font-bold uppercase leading-none text-black">
            Мероприятия
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[520px_1fr] lg:items-stretch">
          <div className="rounded-[4px] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-neutral-200 text-[var(--color-brand-blue)] transition-colors hover:border-[var(--color-brand-blue)]"
                aria-label="Предыдущий месяц"
              >
                <ChevronLeft size={24} />
              </button>

              <h3 className="text-3xl font-bold text-black">
                {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
              </h3>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-neutral-200 text-[var(--color-brand-blue)] transition-colors hover:border-[var(--color-brand-blue)]"
                aria-label="Следующий месяц"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-y-3 text-center">
              {weekDays.map((day) => (
                <div key={day} className="mb-2 text-lg font-bold text-black">
                  {day}
                </div>
              ))}

              {calendarDays.map((day) => {
                const event = events.find((item) => isDateInsideEvent(day.dateKey, item));
                const isSelected = day.dateKey === selectedDateKey;
                const isEventStart = event?.startDate === day.dateKey;
                const isEventEnd = (event?.endDate ?? event?.startDate) === day.dateKey;
                const isSingleDayEvent = Boolean(event && isEventStart && isEventEnd);
                const isRangeEvent = Boolean(event && !isSingleDayEvent);

                return (
                  <div key={day.dateKey} className="relative flex h-12 items-center justify-center">
                    {isRangeEvent ? (
                      <span
                        className={[
                          "absolute top-1/2 h-9 -translate-y-1/2 bg-[var(--color-brand-red)]/20",
                          isEventStart ? "left-1/2" : "left-0",
                          isEventEnd ? "right-1/2" : "right-0",
                        ].join(" ")}
                      />
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setSelectedDateKey(day.dateKey)}
                      className={[
                        "relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold transition-colors",
                        day.isCurrentMonth ? "text-black" : "text-neutral-300",
                        event
                          ? isSingleDayEvent || isEventStart || isEventEnd
                            ? "bg-[var(--color-brand-red)] text-white"
                            : "text-black hover:text-[var(--color-brand-red)]"
                          : "border border-neutral-200 bg-white hover:border-neutral-300 hover:bg-[var(--color-brand-bg)]",
                        isSelected ? "shadow-[0_0_0_4px_rgba(226,30,37,0.22)]" : "",
                      ].join(" ")}
                    >
                      {day.dayNumber}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <article className="flex h-full flex-col overflow-hidden rounded-[4px] border border-neutral-200 bg-white p-6 shadow-sm">
            {selectedEvent ? (
              <>
                <div className="flex items-center gap-2 text-lg font-medium text-[var(--color-brand-blue)]">
                  <MapPin size={22} />
                  {selectedEvent.city}
                </div>

                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="mt-4 h-[190px] w-full rounded-[4px] object-cover"
                />

                <div className="mt-5 flex items-center gap-3 text-lg font-medium text-[var(--color-brand-red)]">
                  <CalendarDays size={22} />
                  {getEventDateText(selectedEvent)}
                </div>

                <h3 className="mt-3 text-4xl font-bold leading-tight text-black">
                  {selectedEvent.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-xl leading-7 text-neutral-800">
                  {selectedEvent.description}
                </p>

                {selectedEvent.detailsUrl ? (
                  <a
                    href={selectedEvent.detailsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex h-11 w-fit items-center justify-center gap-2 rounded-[4px] bg-[var(--color-brand-blue)] px-6 text-lg font-bold text-white transition-colors hover:bg-[#245ba8]"
                  >
                    Подробнее
                    <ExternalLink size={20} strokeWidth={2.3} />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOpenedEvent(selectedEvent)}
                    className="mt-auto inline-flex h-11 w-fit items-center justify-center gap-2 rounded-[4px] bg-[var(--color-brand-blue)] px-6 text-lg font-bold text-white transition-colors hover:bg-[#245ba8]"
                  >
                    Подробнее
                    <ExternalLink size={20} strokeWidth={2.3} />
                  </button>
                )}
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <CalendarDays
                  size={72}
                  strokeWidth={1.8}
                  className="text-[var(--color-brand-blue)]"
                />

                <h3 className="mt-6 text-4xl font-bold text-black">
                  На эту дату мероприятий нет
                </h3>

                <p className="mt-4 max-w-[420px] text-xl leading-7 text-neutral-700">
                  Выберите красную дату в календаре, чтобы посмотреть описание,
                  место проведения и изображение мероприятия.
                </p>
              </div>
            )}
          </article>
        </div>
      </div>

      {openedEvent ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-6">
          <article className="relative max-h-[90vh] w-full max-w-[760px] overflow-auto rounded-[4px] bg-white p-8 shadow-xl">
            <button
              type="button"
              onClick={() => setOpenedEvent(null)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-[4px] text-black transition-colors hover:bg-[var(--color-brand-bg)]"
              aria-label="Закрыть описание мероприятия"
            >
              <X size={26} />
            </button>

            <p className="text-lg font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)]">
              {openedEvent.city}
            </p>

            <h3 className="mt-3 pr-12 text-4xl font-bold leading-tight text-black">
              {openedEvent.title}
            </h3>

            <img
              src={openedEvent.image}
              alt={openedEvent.title}
              className="mt-6 h-[320px] w-full rounded-[4px] object-cover"
            />

            <div className="mt-6 flex items-center gap-3 text-lg font-medium text-[var(--color-brand-red)]">
              <CalendarDays size={22} />
              {getEventDateText(openedEvent)}
            </div>

            <p className="mt-4 text-xl leading-7 text-neutral-800">
              {openedEvent.details}
            </p>
          </article>
        </div>
      ) : null}
    </section>
  );
}
