type DayOrderedEvent = {
  id: number;
  startDate: string;
  endDate?: string;
  dayOrder?: Record<string, number>;
};

export function validDayOrder(value: unknown): value is Record<string, number> | undefined {
  if (value === undefined) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.entries(value);
  return entries.length <= 366 && entries.every(([day, rank]) => /^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isInteger(rank) && rank >= 1 && rank <= 1000);
}

export function eventsForDate<T extends DayOrderedEvent>(events: T[], day: string): T[] {
  return events
    .filter(event => day >= event.startDate && day <= (event.endDate ?? event.startDate))
    .sort((a, b) => (a.dayOrder?.[day] ?? Number.MAX_SAFE_INTEGER) - (b.dayOrder?.[day] ?? Number.MAX_SAFE_INTEGER));
}
