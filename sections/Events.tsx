"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useMemo, useState } from "react";

type EventItem = {
  id: number;
  title: string;
  city: string;
  startDate: string;
  endDate?: string;
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
    title: "XIII Летняя Спартакиада учащихся России",
    city: "Пермь",
    startDate: "2026-08-27",
    endDate: "2026-08-29",
  },
  {
    id: 2,
    title: "XVIII Всероссийские Юношеские Игры боевых искусств",
    city: "Анапа",
    startDate: "2026-09-13",
    endDate: "2026-09-17",
  },
  {
    id: 3,
    title: "Всероссийские соревнования «Киокушин на Волге»",
    city: "Самара",
    startDate: "2026-09-24",
    endDate: "2026-09-28",
  },
  {
    id: 4,
    title: "Всероссийские соревнования «Памяти Сергея Увицкого»",
    city: "Москва",
    startDate: "2026-10-22",
    endDate: "2026-10-26",
  },
  {
    id: 5,
    title: "Чемпионат Дальневосточного ФО",
    city: "Хабаровск",
    startDate: "2026-11-06",
    endDate: "2026-11-09",
  },
  {
    id: 6,
    title: "Первенство Дальневосточного ФО",
    city: "Хабаровск",
    startDate: "2026-11-06",
    endDate: "2026-11-09",
  },
  {
    id: 7,
    title: "Чемпионат Приволжского ФО",
    city: "Пермь",
    startDate: "2026-11-13",
    endDate: "2026-11-16",
  },
  {
    id: 8,
    title: "Первенство Приволжского ФО",
    city: "Пермь",
    startDate: "2026-11-13",
    endDate: "2026-11-16",
  },
  {
    id: 9,
    title: "Чемпионат Уральского ФО",
    city: "Екатеринбург",
    startDate: "2026-11-13",
    endDate: "2026-11-16",
  },
  {
    id: 10,
    title: "Первенство Уральского ФО",
    city: "Екатеринбург",
    startDate: "2026-11-13",
    endDate: "2026-11-16",
  },
  {
    id: 11,
    title: "Чемпионат Северо-Кавказского ФО",
    city: "Нальчик",
    startDate: "2026-11-14",
    endDate: "2026-11-16",
  },
  {
    id: 12,
    title: "Первенство Северо-Кавказского ФО",
    city: "Нальчик",
    startDate: "2026-11-14",
    endDate: "2026-11-16",
  },
  {
    id: 13,
    title: "Чемпионат Сибирского ФО",
    city: "Новосибирск",
    startDate: "2026-11-14",
    endDate: "2026-11-16",
  },
  {
    id: 14,
    title: "Первенство Сибирского ФО",
    city: "Новосибирск",
    startDate: "2026-11-14",
    endDate: "2026-11-16",
  },
  {
    id: 15,
    title: "Чемпионат Южного ФО",
    city: "пгт Энем",
    startDate: "2026-11-20",
    endDate: "2026-11-23",
  },
  {
    id: 16,
    title: "Первенство Южного ФО",
    city: "пгт Энем",
    startDate: "2026-11-20",
    endDate: "2026-11-23",
  },
  {
    id: 17,
    title: "Чемпионат Центрального ФО",
    city: "Москва",
    startDate: "2026-11-28",
    endDate: "2026-11-30",
  },
  {
    id: 18,
    title: "Первенство Центрального ФО",
    city: "Москва",
    startDate: "2026-11-28",
    endDate: "2026-11-30",
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

  return `${start} – ${end}`;
}

export function Events() {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const calendarDays = useMemo(
    () => getCalendarDays(visibleMonth),
    [visibleMonth],
  );

  const selectedEvents = selectedDateKey
    ? events.filter((event) => isDateInsideEvent(selectedDateKey, event))
    : [];

  function changeMonth(direction: number) {
    setVisibleMonth((currentMonth) => {
      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(currentMonth.getMonth() + direction);

      return nextMonth;
    });
  }

  return (
    <section id="events" className="bg-white py-14 sm:py-20">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[520px_1fr] lg:items-stretch">
          <div className="rounded-[4px] bg-white p-3 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-neutral-200 pb-4 text-center sm:mb-6 sm:pb-5">
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)] sm:text-lg">
                Календарь клуба
              </p>

              <h2 className="mt-2 text-3xl font-bold uppercase leading-none text-black sm:text-5xl">
                Мероприятия
              </h2>
            </div>

            <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-neutral-200 text-[var(--color-brand-blue)] transition-colors hover:border-[var(--color-brand-blue)]"
                aria-label="Предыдущий месяц"
              >
                <ChevronLeft size={24} />
              </button>

              <h3 className="text-center text-xl font-bold text-black sm:text-3xl">
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

            <div className="grid grid-cols-7 text-center">
              {weekDays.map((day) => (
                <div key={day} className="mb-2 text-sm font-bold text-black sm:text-lg">
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
                  <div key={day.dateKey} className="relative flex h-10 items-center justify-center sm:h-12">
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
                        "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors sm:h-9 sm:w-9 sm:text-lg",
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

          <article className="flex min-h-[360px] h-full flex-col overflow-hidden rounded-[4px] bg-white p-4 shadow-sm sm:min-h-[420px] sm:p-6">
            {selectedEvents.length > 0 ? (
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3 text-lg font-medium text-[var(--color-brand-red)]">
                  <CalendarDays size={22} />
                  {selectedDateKey?.split("-").reverse().join(".")}
                </div>

                <div className="mt-4 grid gap-3 overflow-y-auto pr-1">
                  {selectedEvents.map((event) => (
                    <article
                      key={event.id}
                      className="w-full rounded-[4px] border border-neutral-200 bg-[var(--color-brand-bg)] p-4 text-left sm:p-5"
                    >
                      <span className="flex items-center gap-2 text-base font-medium text-[var(--color-brand-blue)] sm:text-lg">
                        <MapPin size={20} />
                        {event.city}
                      </span>
                      <span className="mt-2 block text-lg font-bold leading-tight text-black sm:text-2xl">
                        {event.title}
                      </span>
                      <span className="mt-3 flex items-center gap-2 text-base font-bold text-[var(--color-brand-red)]">
                        {getEventDateText(event)}
                      </span>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <CalendarDays
                  size={72}
                  strokeWidth={1.8}
                  className="text-[var(--color-brand-blue)]"
                />

                <h3 className="mt-5 text-2xl font-bold text-black sm:mt-6 sm:text-4xl">
                  {selectedDateKey === null ? "Выберите дату" : "Нет мероприятий"}
                </h3>

                <p className="mt-4 max-w-[420px] text-base leading-6 text-neutral-700 sm:text-xl sm:leading-7">
                  {selectedDateKey === null
                    ? "Чтобы увидеть информацию о мероприятии, выберите дату в календаре."
                    : "На выбранную дату ничего не запланировано."}
                </p>
              </div>
            )}
          </article>
        </div>
      </div>

    </section>
  );
}
