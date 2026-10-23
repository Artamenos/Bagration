"use client";

import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import styles from "./EventPanel.module.css";
import { type CSSProperties, useState } from "react";

type PanelEvent = { id: number; title: string; city: string; startDate: string; endDate?: string; layout?: "poster" | "photo"; image?: string; description?: string };
const dateText = (date: string) => date.split("-").reverse().join(".");

export function EventPanel({ events, index, date, onSelect, height }: { events: PanelEvent[]; index: number; date: string | null; onSelect: (index: number) => void; height: number }) {
  const [imageRatio, setImageRatio] = useState(1080 / 1536);
  const item = events[index];
  return <aside className={`${styles.panel} rounded-[4px] bg-white shadow-sm`} style={{ "--calendar-height": `${height}px`, "--poster-width": `${height * imageRatio}px` } as CSSProperties} aria-label="Информация о мероприятии">
    <div className={styles.header}>
      {events.length > 1 ? <div className={styles.navigation}>
        <button type="button" aria-label="Предыдущее событие" onClick={() => onSelect((index - 1 + events.length) % events.length)}><ChevronLeft size={20} /></button>
        <span aria-live="polite">{index + 1}<span className={styles.total}> / {events.length}</span></span>
        <button type="button" aria-label="Следующее событие" onClick={() => onSelect((index + 1) % events.length)}><ChevronRight size={20} /></button>
      </div> : null}
    </div>
    {item ? <div key={item.id} className={`${styles.body} ${item.layout === "poster" ? styles.poster : styles.photo}`} aria-live="polite">
      <div className={`${styles.visual} ${!item.image ? styles.placeholder : ""}`}>
        <img src={item.image || "/images/logo_coaches.png"} alt={item.image ? item.title : "Спортивный клуб Багратион"} onLoad={(event) => { const img = event.currentTarget; if (img.naturalHeight) setImageRatio(img.naturalWidth / img.naturalHeight); }} onError={(event) => { const img = event.currentTarget; if (!img.src.endsWith("/images/logo_coaches.png")) { img.src = "/images/logo_coaches.png"; img.parentElement?.classList.add(styles.placeholder); } }} />
      </div>
      <div className={styles.copy}>
        <span className={styles.eyebrow}>{item.layout === "poster" ? "ТУРНИР" : "ЖИЗНЬ КЛУБА"}</span>
        <h3>{item.title}</h3>
        <div className={styles.meta}>
          <p><CalendarDays size={17} /><span>{dateText(item.startDate)}{item.endDate && item.endDate !== item.startDate ? ` — ${dateText(item.endDate)}` : ""}</span></p>
          <p><MapPin size={17} /><span>{item.city}</span></p>
        </div>
        {item.description ? <p className={styles.description}>{item.description}</p> : null}
      </div>
    </div> : <div className={styles.empty}><div className={styles.logoMark}><img src="/images/logo_coaches.png" alt="Багратион" /></div><span className={styles.emptyEyebrow}>ТУРНИРЫ · СБОРЫ · ЖИЗНЬ КЛУБА</span><h3>{date ? "На эту дату событий нет" : "Выберите дату"}</h3><p>{date ? "Посмотрите другие дни календаря." : "Выберите день в календаре слева, чтобы узнать о мероприятии."}</p></div>}
  </aside>;
}
