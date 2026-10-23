"use client";
import { usePublishedContent } from "@/components/usePublishedContent";
import { EventPanel } from "@/components/EventPanel";
import panelStyles from "@/components/EventPanel.module.css";
import { eventsForDate, validDayOrder } from "@/components/eventOrdering";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type EventItem = {
  id: number;
  title: string;
  city: string;
  startDate: string;
  endDate?: string;
  layout?: "poster" | "photo";
  image?: string;
  description?: string;
  dayOrder?: Record<string, number>;
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
    layout: "poster",
    title: "XIII Летняя Спартакиада учащихся России",
    city: "Пермь",
    startDate: "2026-08-27",
    endDate: "2026-08-29",
  },
  {
    id: 2,
    layout: "poster",
    title: "XVIII Всероссийские Юношеские Игры боевых искусств",
    city: "Анапа",
    startDate: "2026-09-13",
    endDate: "2026-09-17",
  },
  {
    id: 3,
    layout: "poster",
    title: "Всероссийские соревнования «Киокушин на Волге»",
    city: "Самара",
    startDate: "2026-09-24",
    endDate: "2026-09-28",
  },
  {
    id: 4,
    layout: "poster",
    title: "Всероссийские соревнования «Памяти Сергея Увицкого»",
    city: "Москва",
    startDate: "2026-10-22",
    endDate: "2026-10-26",
  },
  {
    id: 5,
    layout: "poster",
    title: "Чемпионат Дальневосточного ФО",
    city: "Хабаровск",
    startDate: "2026-11-06",
    endDate: "2026-11-09",
  },
  {
    id: 6,
    layout: "poster",
    title: "Первенство Дальневосточного ФО",
    city: "Хабаровск",
    startDate: "2026-11-06",
    endDate: "2026-11-09",
  },
  {
    id: 7,
    layout: "poster",
    title: "Чемпионат Приволжского ФО",
    city: "Пермь",
    startDate: "2026-11-13",
    endDate: "2026-11-16",
  },
  {
    id: 8,
    layout: "poster",
    title: "Первенство Приволжского ФО",
    city: "Пермь",
    startDate: "2026-11-13",
    endDate: "2026-11-16",
  },
  {
    id: 9,
    layout: "poster",
    title: "Чемпионат Уральского ФО",
    city: "Екатеринбург",
    startDate: "2026-11-13",
    endDate: "2026-11-16",
  },
  {
    id: 10,
    layout: "poster",
    title: "Первенство Уральского ФО",
    city: "Екатеринбург",
    startDate: "2026-11-13",
    endDate: "2026-11-16",
  },
  {
    id: 11,
    layout: "poster",
    title: "Чемпионат Северо-Кавказского ФО",
    city: "Нальчик",
    startDate: "2026-11-14",
    endDate: "2026-11-16",
  },
  {
    id: 12,
    layout: "poster",
    title: "Первенство Северо-Кавказского ФО",
    city: "Нальчик",
    startDate: "2026-11-14",
    endDate: "2026-11-16",
  },
  {
    id: 13,
    layout: "poster",
    title: "Чемпионат Сибирского ФО",
    city: "Новосибирск",
    startDate: "2026-11-14",
    endDate: "2026-11-16",
  },
  {
    id: 14,
    layout: "poster",
    title: "Первенство Сибирского ФО",
    city: "Новосибирск",
    startDate: "2026-11-14",
    endDate: "2026-11-16",
  },
  {
    id: 15,
    layout: "poster",
    title: "Чемпионат Южного ФО",
    city: "пгт Энем",
    startDate: "2026-11-20",
    endDate: "2026-11-23",
  },
  {
    id: 16,
    layout: "poster",
    title: "Первенство Южного ФО",
    city: "пгт Энем",
    startDate: "2026-11-20",
    endDate: "2026-11-23",
  },
  {
    id: 17,
    layout: "poster",
    title: "Чемпионат Центрального ФО",
    city: "Москва",
    startDate: "2026-11-28",
    endDate: "2026-11-30",
  },
  {
    id: 18,
    layout: "poster",
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

function validEvent(item: unknown): item is EventItem {
  if (!item || typeof item !== "object") return false;
  const e = item as EventItem;
  return Number.isInteger(e.id) && typeof e.title === "string" && typeof e.city === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.startDate) && (!e.endDate || /^\d{4}-\d{2}-\d{2}$/.test(e.endDate)) && (!e.layout || ["poster","photo"].includes(e.layout)) && (!e.image || /^\/(images\/[\w.-]+|media\/[a-f0-9]{32}\.jpg)$/.test(e.image)) && (e.description === undefined || typeof e.description === "string") && validDayOrder(e.dayOrder);
}

export function Events() {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [calendarHeight, setCalendarHeight] = useState(480);
  useEffect(() => {
    const element = calendarRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setCalendarHeight(element.getBoundingClientRect().height));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const publishedEvents = usePublishedContent("events", events, validEvent);
  const currentEvents = publishedEvents;
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);

  const calendarDays = useMemo(
    () => getCalendarDays(visibleMonth),
    [visibleMonth],
  );

  const selectedEvents = selectedDateKey
    ? eventsForDate(currentEvents, selectedDateKey)
    : [];
  const activeEventIndex = Math.min(selectedEventIndex, Math.max(0, selectedEvents.length - 1));

  function changeMonth(direction: number) {
    setVisibleMonth((currentMonth) => {
      const nextMonth = new Date(currentMonth);
      nextMonth.setDate(1);
      nextMonth.setMonth(currentMonth.getMonth() + direction);

      return nextMonth;
    });
  }

  return (
    <section id="events" className="bg-white py-14 sm:py-20">
      <div className="site-container">
        <div className={`${panelStyles.eventShell} ${panelStyles.designAccent} grid grid-cols-1 items-start gap-8 lg:grid-cols-[520px_1fr]`}>
          <div ref={calendarRef} className={`${panelStyles.calendar} rounded-[4px] bg-white p-3 shadow-sm sm:p-6`}>
            <div className={`${panelStyles.calendarHeading} mb-5 border-b border-neutral-200 pb-4 text-center sm:mb-6 sm:pb-5`}>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)] sm:text-lg">
                Календарь клуба
              </p>

              <h2 className="mt-2 text-3xl font-bold uppercase leading-none text-black sm:text-5xl">
                Мероприятия
              </h2>
            </div>

            <div className={`${panelStyles.monthBar} mb-4 flex items-center justify-between gap-2 sm:mb-6`}>
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
                const dayEvents = currentEvents.filter((item) => isDateInsideEvent(day.dateKey, item));
                const event = dayEvents[0];
                const isSelected = day.dateKey === selectedDateKey;
                const isEventStart = dayEvents.some(item => item.startDate === day.dateKey);
                const isEventEnd = dayEvents.some(item => (item.endDate ?? item.startDate) === day.dateKey);
                const isSingleDayEvent = dayEvents.some(item => (item.endDate ?? item.startDate) === item.startDate);
                // A single-day event must not interrupt another event's continuous range.
                const connectsLeft = dayEvents.some(item => item.startDate < day.dateKey);
                const connectsRight = dayEvents.some(item => (item.endDate ?? item.startDate) > day.dateKey);
                const isRangeEvent = connectsLeft || connectsRight;

                return (
                  <div key={day.dateKey} className="relative flex h-10 items-center justify-center sm:h-12">
                    {isRangeEvent ? (
                      <span
                        className={[
                          "absolute top-1/2 h-9 -translate-y-1/2 bg-[var(--color-brand-red)]/10",
                          connectsLeft ? "left-0" : "left-1/2",
                          connectsRight ? "right-0" : "right-1/2",
                        ].join(" ")}
                      />
                    ) : null}

                    <button
                      type="button"
                      onClick={() => { setSelectedDateKey(day.dateKey); setSelectedEventIndex(0); }}
                      aria-label={`${day.dateKey}: событий — ${dayEvents.length}`}
                      aria-pressed={isSelected}
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

          <EventPanel events={selectedEvents} index={activeEventIndex} date={selectedDateKey} onSelect={setSelectedEventIndex} height={calendarHeight} />
        </div>
      </div>

    </section>
  );
}
