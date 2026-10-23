"use client";

import { useEffect, useState } from "react";

export function usePublishedContent<T>(kind: "news" | "events", fallback: T[], validate: (item: unknown) => item is T): T[] {
  const [items, setItems] = useState(fallback);
  useEffect(() => {
    let alive = true;
    let running = false;
    async function refresh() {
      if (running || document.visibilityState === "hidden") return;
      running = true;
      const data = await fetch("/content/current.json", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const text = await response.text();
        if (text.length > 2_000_000) return null;
        const data = JSON.parse(text);
        return data.schemaVersion === 1 ? data : null;
      }).catch(() => null);

      const values = data?.[kind];
      if (alive && Array.isArray(values) && values.length <= 1000 && values.every(validate)) {
        setItems(current => JSON.stringify(current) === JSON.stringify(values) ? current : values);
      }
      running = false;
    }
    void refresh();
    const interval = window.setInterval(() => void refresh(), 10000);
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      alive = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [kind, fallback, validate]);
  return items;
}
