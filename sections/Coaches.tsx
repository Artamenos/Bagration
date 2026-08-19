"use client";

import { Award, ExternalLink, MapPin, Trophy, X } from "lucide-react";
import { type ReactNode, useState } from "react";

type ScheduleRow = {
  day: string;
  time: string;
  group?: string;
};

type ScheduleSection = {
  title?: string;
  rows: ScheduleRow[];
};

type Coach = {
  id: number;
  name: string;
  role: string;
  rank: string;
  photo: string;
  modalPhoto?: string;
  about: string;
  cardAddress: string;
  transit: {
    label: string;
    color: string;
  };
  hall: {
    name: string;
    address: string;
    mapQuery: string;
  };
  additionalHalls?: Array<{
    name: string;
    address: string;
    mapQuery: string;
  }>;
  schedules: ScheduleSection[];
  sportAchievements: string[];
  coachingAchievements: string[];
  personalAchievements: string[];
};

const coaches: Coach[] = [
  {
    id: 1,
    name: "Бахчиев Арменак Александрович",
    role: "Президент РФСОО «Московская областная федерация по виду спорта киокушин»",
    rank: "III дан",
    photo: "/images/Armenak_vin.png",
    modalPhoto: "/images/Armenak_kick.png",
    about:
      "Президент Московской областной федерации по виду спорта киокушин, педагог дополнительного образования и учитель физической культуры высшей категории.",
    cardAddress: "Астрадамский пр., д. 5",
    transit: { label: "метро Тимирязевская", color: "#A1A2A3" },
    hall: {
      name: "Зал на Астрадамском проезде",
      address: "Москва, Астрадамский пр., д. 5",
      mapQuery: "Москва, Астрадамский проезд, 5",
    },
    schedules: [
      {
        rows: [
          { day: "Понедельник", time: "19:00–21:00", group: "Взрослые" },
          { day: "Вторник", time: "16:00–17:00", group: "Начинающие" },
          { day: "", time: "17:00–18:00", group: "2–3-й год обучения" },
          { day: "Четверг", time: "16:00–17:00", group: "Начинающие" },
          { day: "", time: "17:00–18:00", group: "2–3-й год обучения" },
          { day: "", time: "20:00–22:00", group: "Взрослые" },
        ],
      },
    ],
    sportAchievements: [
      "Чемпион Москвы 2016 (Шинкиокушин)",
      "Серебряный призёр чемпионата Москвы 2017 (Шинкиокушин)",
      "Серебряный призёр чемпионата ЦФО 2014 (Кекусин-кан)",
      "Серебряный призёр международного турнира «Кубок Полесья» (KWU)",
      "Чемпион Московской области 2007 (ИКО)",
    ],
    coachingAchievements: [
      "Воспитал победителей первенств Москвы и Московской области 2012–2019 (КАН, ШИН, ИКО, ИФК)",
      "Воспитал победителей первенств ЦФО 2014–2017 (Мацушима, КАН, ШИН)",
      "Воспитал победителя и призёра первенства России 2014, 2016 (КАН, ШИН)",
      "Воспитал победителей первенства России 2018 (Ико-Мацушима)",
      "Воспитал серебряного и бронзового призёров первенства Китая 2018",
      "Воспитал бронзовых призёров первенства Европы 2018 (ИФК)",
      "Воспитал бронзового призёра первенства Европы 2015 (KWU)",
      "Воспитал серебряного призёра первенства Европы 2015 (Ренгокай)",
      "Воспитал победителей первенства России 2020 (СО-Киокушин)",
      "Воспитал победителей Всероссийского турнира «Кубок КВФ» 2021–2022",
      "Воспитал чемпиона России по Ашихара-каратэ, призёров всероссийских первенств и чемпиона Москвы среди студентов",
    ],
    personalAchievements: [
      "Педагог дополнительного образования высшей категории, учитель физической культуры высшей категории",
      "Награждён грамотой Департамента образования города Москвы",
      "Грамота от партии Единая Россия за реализацию проекта «Детский спорт»",
      "Благодарность министра спорта Республики Дагестан",
      "Благодарность министра спорта Чувашской Республики",
      "Благодарность международной ассоциации ветеранов подразделения антитеррора «Альфа»",
    ],
  },
  {
    id: 2,
    name: "Медведев Михаил Валентинович",
    role: "Председатель коллегии судей Московской областной федерации киокушин",
    rank: "II дан, КМС, спортивный судья 2-й категории",
    photo: "/images/Mihail_vin.png",
    modalPhoto: "/images/Mihail_kick.png",
    about:
      "Тренер-преподаватель и председатель коллегии судей региональной федерации. Проводит занятия для детей разных возрастных групп в Москве и Лобне.",
    cardAddress: "Лобня, ул. Чехова, 3А",
    transit: { label: "МЦД-1 Лобня", color: "#F6A600" },
    hall: { name: "Зал в Москве", address: "Москва, Тимирязево", mapQuery: "Москва, Тимирязево" },
    additionalHalls: [
      { name: "Зал в Лобне", address: "Лобня, ул. Чехова, 3А", mapQuery: "Лобня, улица Чехова, 3А" },
    ],
    schedules: [
      {
        title: "Москва, Тимирязево",
        rows: [
          { day: "Понедельник", time: "17:00–17:45", group: "Дети 4–7 лет" },
          { day: "", time: "17:45–19:15", group: "Дети 7–17 лет" },
          { day: "Среда", time: "17:00–17:45", group: "Дети 4–7 лет" },
          { day: "", time: "17:45–19:15", group: "Дети 7–17 лет" },
          { day: "Пятница", time: "17:00–17:45", group: "Дети 4–7 лет" },
          { day: "", time: "17:45–19:15", group: "Дети 7–17 лет" },
        ],
      },
      {
        title: "Лобня, ул. Чехова",
        rows: [
          { day: "Вторник", time: "09:30–10:30", group: "Дети 7–15 лет" },
          { day: "", time: "18:00–19:00", group: "Дети 7–15 лет" },
          { day: "Четверг", time: "09:30–10:30", group: "Дети 7–15 лет" },
          { day: "", time: "18:00–19:00", group: "Дети 7–15 лет" },
        ],
      },
    ],
    sportAchievements: [
      "Победитель чемпионата ЦФО (ката-группа)",
      "Серебряный призёр Кубка мира",
      "Бронзовый призёр чемпионата Европы",
      "Бронзовый призёр Кубка столицы",
    ],
    coachingAchievements: [
      "Воспитал победителей первенств Москвы 2021–2023",
      "Воспитал победителей первенств Московской области 2020–2023",
      "Воспитал победителей и призёров всероссийских соревнований 2022–2023",
    ],
    personalAchievements: [],
  },
  {
    id: 3,
    name: "Аберхаев Адель Айясович",
    role: "Тренер-преподаватель Московской областной федерации киокушин",
    rank: "II дан, КМС",
    photo: "/images/Adel_vin.png",
    modalPhoto: "/images/Adel_kick.png",
    about:
      "Тренер-преподаватель, кандидат в мастера спорта. Проводит занятия для младшей и старшей детских групп.",
    cardAddress: "проспект Вернадского, 94к7",
    transit: { label: "метро Тропарёво", color: "#E42313" },
    hall: { name: "Зал на проспекте Вернадского", address: "Москва, проспект Вернадского, 94к7", mapQuery: "Москва, проспект Вернадского, 94к7" },
    schedules: [
      {
        rows: [
          { day: "Вторник", time: "17:00–18:00", group: "Младшая группа, 6–8 лет" },
          { day: "", time: "18:00–19:00", group: "Старшая группа, 8–15 лет" },
          { day: "Четверг", time: "17:00–18:00", group: "Младшая группа, 6–8 лет" },
          { day: "", time: "18:00–19:00", group: "Старшая группа, 8–15 лет" },
          { day: "Суббота", time: "17:00–18:00", group: "Младшая группа, 6–8 лет" },
          { day: "", time: "18:00–19:00", group: "Старшая группа, 8–15 лет" },
        ],
      },
    ],
    sportAchievements: [
      "Призёр Кубка Содружества",
      "Чемпион России 2021",
      "Серебряный призёр чемпионата Европы 2022",
    ],
    coachingAchievements: [
      "Воспитал призёров первенств Москвы 2021–2023",
      "Воспитал призёров первенств Московской области 2020–2023",
      "Воспитал призёров всероссийских соревнований 2022–2023",
    ],
    personalAchievements: [],
  },
  {
    id: 4,
    name: "Улещенко Андрей Андреевич",
    role: "Тренер-преподаватель Московской областной федерации киокушин",
    rank: "I дан, МСМК",
    photo: "/images/Andrei_vin.png",
    about:
      "Мастер спорта международного класса по карате киокушинкай. Более десяти лет работает детским тренером.",
    cardAddress: "ул. Расплетина, 1",
    transit: { label: "метро Октябрьское Поле", color: "#8E479C" },
    hall: { name: "Зал на улице Расплетина", address: "Москва, ул. Расплетина, 1", mapQuery: "Москва, улица Расплетина, 1" },
    schedules: [
      {
        rows: [
          { day: "Понедельник", time: "17:00–18:00, 18:00–19:00, 19:00–20:00" },
          { day: "Вторник", time: "18:00–19:00, 19:00–20:00" },
          { day: "Среда", time: "17:00–18:00, 18:00–19:00, 19:00–20:00" },
          { day: "Четверг", time: "18:00–19:00, 19:00–20:00" },
          { day: "Пятница", time: "17:00–18:00, 18:00–19:00, 19:00–20:00" },
        ],
      },
    ],
    sportAchievements: [
      "Серебряный призёр чемпионата мира",
      "Чемпион Европы",
      "Двукратный чемпион России",
      "Мастер спорта международного класса по карате киокушинкай",
      "В 2016 году входил в топ-10 лучших бойцов мира до 90 кг среди всех федераций карате киокушинкай",
    ],
    coachingAchievements: [
      "10 лет работы детским тренером",
      "Тренировал детей российских звёзд, блогеров и предпринимателей",
    ],
    personalAchievements: [],
  },
  {
    id: 5,
    name: "Лушкина Вера Анатольевна",
    role: "Тренер-преподаватель Московской областной федерации киокушин",
    rank: "I дан, КМС",
    photo: "/images/Vera_vin.png",
    modalPhoto: "/images/Vera_kick.png",
    about:
      "Тренер-преподаватель, кандидат в мастера спорта. Готовит учеников к городским, областным и всероссийским соревнованиям.",
    cardAddress: "Апрелевка, ул. Жасминовая, 10",
    transit: { label: "МЦД-4 Апрелевка", color: "#40B7AD" },
    hall: { name: "Зал на Жасминовой улице", address: "Апрелевка, ул. Жасминовая, д. 10", mapQuery: "Апрелевка, улица Жасминовая, 10" },
    schedules: [
      {
        rows: [
          { day: "Понедельник", time: "15:00–16:00, 16:00–18:00" },
          { day: "Среда", time: "15:00–16:00, 16:00–18:00" },
          { day: "Пятница", time: "16:00–18:00" },
        ],
      },
    ],
    sportAchievements: ["Призёр Кубка Содружества"],
    coachingAchievements: [
      "Воспитала призёров первенств Москвы 2021–2023",
      "Воспитала призёров первенств Московской области 2020–2023",
      "Воспитала призёров всероссийских соревнований 2022–2023",
    ],
    personalAchievements: [],
  },
  {
    id: 6,
    name: "Кураш Анастасия Александровна",
    role: "Тренер-преподаватель Московской областной федерации киокушин",
    rank: "6 кю",
    photo: "/images/Anastasia_vin.png",
    about:
      "Педагог по физической культуре и спорту. Проводит занятия для младших и старших групп в Апрелевке и Изварино.",
    cardAddress: "Апрелевка, ул. Августовская, 14",
    transit: { label: "МЦД-4 Апрелевка", color: "#40B7AD" },
    hall: { name: "Зал в Апрелевке", address: "Апрелевка, ул. Августовская, 14", mapQuery: "Апрелевка, улица Августовская, 14" },
    additionalHalls: [
      { name: "Зал в Изварино", address: "Изварино", mapQuery: "Москва, Изварино" },
    ],
    schedules: [
      {
        title: "Апрелевка",
        rows: [
          { day: "Пн", time: "16:00–16:30", group: "Жасминовая, 9 — 4+" },
          { day: "", time: "17:30–18:00", group: "Парковая, 8/3 — 4+" },
          { day: "", time: "18:00–19:00", group: "Августовская, 14 — младшая 4+" },
          { day: "", time: "18:00–19:00", group: "Августовская, 14 — старшая 7+" },
          { day: "Ср", time: "16:00–16:30", group: "Жасминовая, 9 — 4+" },
          { day: "", time: "17:30–18:00", group: "Самохина, 9 — 4+" },
          { day: "", time: "18:00–19:00", group: "Августовская, 14 — младшая 4+" },
          { day: "", time: "18:00–19:00", group: "Августовская, 14 — старшая 7+" },
          { day: "Пт", time: "16:00–16:30", group: "Парковая, 8/3 — 4+" },
          { day: "", time: "17:30–18:00", group: "Самохина, 9 — 4+" },
          { day: "", time: "18:00–19:00", group: "Августовская, 14 — старшая 7+" },
        ],
      },
      {
        title: "Изварино",
        rows: [
          { day: "Пн", time: "10:00–11:00", group: "Старшая группа" },
          { day: "Вт", time: "17:00–18:00", group: "Младшая группа" },
          { day: "", time: "18:00–19:00", group: "Старшая группа" },
          { day: "Ср", time: "10:00–11:00", group: "Старшая группа" },
          { day: "Чт", time: "17:00–18:00", group: "Младшая группа" },
          { day: "", time: "18:00–19:00", group: "Старшая группа" },
          { day: "Пт", time: "10:00–11:00", group: "Старшая группа" },
          { day: "Сб", time: "12:00–13:00", group: "Старшая группа" },
        ],
      },
    ],
    sportAchievements: [
      "2-е место на турнире «Кубок Кроношпан» 2023",
      "3-е место на Кубке Коломенского Кремля 2023",
      "3-е место на турнире «Сильнейший из Кайман» 2025",
    ],
    coachingAchievements: [],
    personalAchievements: [
      "Образование: Московский государственный университет спорта и туризма",
      "Диплом о среднем профессиональном образовании",
      "Квалификация: педагог по физической культуре и спорту",
      "Специальность 49.02.01 «Физическая культура»",
    ],
  },
  {
    id: 7,
    name: "Иванова Елизавета Дмитриевна",
    role: "Тренер-преподаватель Московской областной федерации киокушин",
    rank: "III дан",
    photo: "/images/Elisaveta_vin.png",
    about:
      "Мастер спорта по киокусинкай, спортивный судья второй категории. Тренерский стаж — семь лет.",
    cardAddress: "ул. Тимирязевская, д. 16",
    transit: { label: "метро Тимирязевская", color: "#A1A2A3" },
    hall: { name: "Зал на Тимирязевской", address: "Москва, ул. Тимирязевская, д. 16", mapQuery: "Москва, улица Тимирязевская, 16" },
    schedules: [
      {
        title: "ОФП с элементами карате, 4+",
        rows: [
          { day: "Вторник", time: "17:30–18:30", group: "ул. Августовская" },
          { day: "Четверг", time: "17:30–18:30", group: "ул. Августовская" },
        ],
      },
    ],
    sportAchievements: [
      "Призёр чемпионата мира",
      "Чемпион Европы",
      "Победитель Кубка России",
      "Призёр чемпионата России",
      "Победитель первенства Европы",
      "Призёр первенства мира",
      "Четырёхкратный победитель первенства России",
    ],
    coachingAchievements: ["Стаж тренерской работы — 7 лет"],
    personalAchievements: [
      "Российский государственный университет физической культуры и спорта — тренер по киокусинкай",
      "МГИМО — международные отношения в спорте",
      "Мастер спорта по киокусинкай",
      "КМС по киокушин",
      "Спортивный судья 2-й категории",
    ],
  },
  {
    id: 8,
    name: "Хасянов Рустам Рашидович",
    role: "Тренер-преподаватель Московской областной федерации киокушин",
    rank: "4 кю, 1-й спортивный разряд по киокушин",
    photo: "/images/Rustam_vin.png",
    modalPhoto: "/images/Rustam_kick.png",
    about:
      "Тренер-преподаватель, спортивный судья третьей категории. Имеет первый спортивный разряд по киокушин и звание КМС по вольной борьбе.",
    cardAddress: "ул. Яблочкова, д. 7",
    transit: { label: "метро Тимирязевская", color: "#A1A2A3" },
    hall: { name: "АПИА Арена", address: "Москва, ул. Яблочкова, д. 7", mapQuery: "Москва, улица Яблочкова, 7" },
    schedules: [
      {
        title: "Летний период",
        rows: [
          { day: "Понедельник", time: "19:00–20:00" },
          { day: "Вторник", time: "19:00–20:00" },
          { day: "Пятница", time: "18:00–19:00" },
        ],
      },
    ],
    sportAchievements: [
      "Победитель и призёр чемпионата Московской области",
      "Победитель и призёр Кубка Московской области",
      "Призёр чемпионата России KWF среди ветеранов",
      "Победитель международного Патриаршего фестиваля Николая Японского",
    ],
    coachingAchievements: [],
    personalAchievements: [
      "4 кю, зелёный пояс",
      "1-й спортивный разряд по киокушин",
      "КМС по вольной борьбе",
      "Спортивный судья 3-й категории",
    ],
  },
];

function CoachCard({ coach, onOpen }: { coach: Coach; onOpen: (coach: Coach) => void }) {
  const shortName = coach.name.split(" ").slice(0, 2).join(" ");

  return (
    <article className="w-[240px] overflow-hidden rounded-[4px] border border-neutral-200 bg-[var(--color-brand-bg)] shadow-sm">
      <div
        className="relative h-[295px] overflow-hidden bg-[var(--color-brand-bg)] bg-top bg-no-repeat"
        style={{
          backgroundImage: "url('/images/logo_coaches.png')",
          backgroundSize: "240px auto",
        }}
      >
        <img src={coach.photo} alt={coach.name} className="absolute bottom-0 left-0 z-10 w-full" />
      </div>

      <div className="h-[112px] bg-white px-3 py-2 text-center">
        <h3 className="truncate text-base font-medium leading-5 text-black">{shortName}</h3>

        <div className="mt-1 flex h-8 items-center justify-center gap-2 text-left text-[11px] leading-[14px] text-neutral-600">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: coach.transit.color }}
            title={coach.transit.label}
            aria-label={coach.transit.label}
          />
          <span className="line-clamp-2">{coach.cardAddress}</span>
        </div>

        <button
          type="button"
          onClick={() => onOpen(coach)}
          className="mt-1.5 w-full cursor-pointer rounded-[6px] bg-[var(--color-brand-bg)] px-3 py-1.5 text-sm font-medium text-[var(--color-brand-blue)] transition-colors hover:bg-[var(--color-brand-blue)] hover:text-white"
        >
          Открыть информацию
        </button>
      </div>
    </article>
  );
}

type CoachPanel = "coaching" | "sport" | "personal" | "schedule";

function InfoList({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-2xl font-bold leading-tight text-black">
        {icon}
        {title}
      </h4>

      <ul className="mt-4 space-y-2 text-base leading-5 text-neutral-800">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-red)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PanelButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-[6px] px-5 py-2 text-lg font-bold transition-colors",
        isActive
          ? "bg-[var(--color-brand-red)] text-white"
          : "bg-[var(--color-brand-bg)] text-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)] hover:text-white",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function ScheduleTable({ rows, compact = false }: { rows: ScheduleRow[]; compact?: boolean }) {
  const hasGroups = rows.some((row) => Boolean(row.group));

  return (
    <div className="overflow-hidden rounded-[4px] border border-neutral-200">
      <table className={`w-full table-fixed border-collapse bg-white text-left ${compact ? "text-xs leading-[1.05]" : "text-sm leading-tight"}`}>
        <thead className="bg-[var(--color-brand-bg)] text-black">
          <tr>
            <th className={`w-[22%] border border-neutral-200 px-2 font-bold ${compact ? "py-0.5" : "py-2"}`}>День</th>
            <th className={`${hasGroups ? "w-[28%] " : ""}border border-neutral-200 px-2 font-bold ${compact ? "py-0.5" : "py-2"}`}>Время</th>
            {hasGroups ? <th className={`border border-neutral-200 px-2 font-bold ${compact ? "py-0.5" : "py-2"}`}>Группа / адрес</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.day}-${row.time}-${index}`}>
              <td className={`border border-neutral-200 px-2 align-top ${compact ? "py-px" : "py-1"}`}>{row.day}</td>
              <td className={`border border-neutral-200 px-2 align-top ${compact ? "py-px" : "py-1"}`}>{row.time}</td>
              {hasGroups ? <td className={`border border-neutral-200 px-2 align-top ${compact ? "py-px" : "py-1"}`}>{row.group}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoachModal({ coach, onClose }: { coach: Coach; onClose: () => void }) {
  const [activePanel, setActivePanel] = useState<CoachPanel | null>(null);
  const halls = [coach.hall, ...(coach.additionalHalls ?? [])];
  const modalPhoto = coach.modalPhoto ?? coach.photo;

  function togglePanel(panel: CoachPanel) {
    setActivePanel((currentPanel) => (currentPanel === panel ? null : panel));
  }

  function renderActivePanel() {
    if (activePanel === "schedule") {
      return (
        <div className="h-full">
          <h4 className="mb-2 flex items-center gap-2 text-xl font-bold leading-tight text-black">
            <MapPin size={21} className="text-[var(--color-brand-blue)]" />
            Расписание
          </h4>
          <div className={coach.schedules.length > 1 ? "space-y-2" : ""}>
            {coach.schedules.map((schedule, index) => (
              <section key={`${schedule.title ?? "schedule"}-${index}`}>
                {schedule.title ? (
                  <h5 className="mb-1 text-xs font-bold leading-tight text-[var(--color-brand-blue)]">{schedule.title}</h5>
                ) : null}
                <ScheduleTable rows={schedule.rows} compact={coach.schedules.length > 1} />
              </section>
            ))}
          </div>
        </div>
      );
    }

    if (activePanel === "coaching") {
      return (
        <InfoList
          title="Тренерские достижения"
          icon={<Award size={24} className="text-[var(--color-brand-blue)]" />}
          items={coach.coachingAchievements}
        />
      );
    }

    if (activePanel === "sport") {
      return (
        <InfoList
          title="Спортивные достижения"
          icon={<Trophy size={24} className="text-[var(--color-brand-blue)]" />}
          items={coach.sportAchievements}
        />
      );
    }

    return (
      <InfoList
        title="Личные достижения"
        icon={<Award size={24} className="text-[var(--color-brand-blue)]" />}
        items={coach.personalAchievements}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 px-5 py-8">
      <div className="relative h-[740px] w-full max-w-[1320px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-[4px] bg-white/90 text-black transition-colors hover:bg-[var(--color-brand-bg)]"
          aria-label="Закрыть окно тренера"
        >
          <X size={28} />
        </button>

        <article className="relative h-full overflow-hidden rounded-[4px] bg-white shadow-2xl">
        <div className="grid h-full rounded-[4px] bg-white grid-cols-1 lg:grid-cols-[1fr_440px]">
          <div className="p-6 lg:p-7">
            <p className="text-base font-medium uppercase leading-none tracking-[0.12em] text-[var(--color-brand-blue)]">Тренер клуба</p>

            <h3 className="mt-2 text-4xl font-bold uppercase leading-none text-black">{coach.name}</h3>

            <div className="mt-3 flex flex-wrap gap-2 text-sm font-medium">
              <span className="bg-[var(--color-brand-bg)] px-3 py-1.5 text-[var(--color-brand-blue)]">{coach.role}</span>
              <span className="bg-[var(--color-brand-bg)] px-3 py-1.5 text-[var(--color-brand-red)]">{coach.rank}</span>
            </div>

            <p className="mt-3 max-w-[760px] text-base leading-5 text-neutral-800">{coach.about}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {coach.coachingAchievements.length > 0 ? <PanelButton label="Тренерские достижения" isActive={activePanel === "coaching"} onClick={() => togglePanel("coaching")} /> : null}
              {coach.sportAchievements.length > 0 ? <PanelButton label="Спортивные достижения" isActive={activePanel === "sport"} onClick={() => togglePanel("sport")} /> : null}
              {coach.personalAchievements.length > 0 ? <PanelButton label="Личные достижения" isActive={activePanel === "personal"} onClick={() => togglePanel("personal")} /> : null}
              <div className={coach.id === 1 ? "[&>button]:w-full" : "col-span-2 [&>button]:w-full"}>
                <PanelButton label="Расписание" isActive={activePanel === "schedule"} onClick={() => togglePanel("schedule")} />
              </div>
            </div>

            <div className="relative mt-4 h-[420px] rounded-[4px] border border-neutral-200 bg-[var(--color-brand-bg)] p-2">
              {activePanel ? (
                <div className={activePanel === "schedule" ? "h-full overflow-hidden rounded-[4px] bg-white p-3" : "h-full overflow-y-auto rounded-[4px] bg-white p-6"}>
                  {renderActivePanel()}
                </div>
              ) : (
                <>
                  <div className={`grid h-full overflow-hidden rounded-[4px] ${halls.length > 1 ? "grid-rows-2 gap-2" : "grid-rows-1"}`}>
                    {halls.map((hall) => (
                      <div key={hall.mapQuery} className="relative min-h-0 overflow-hidden rounded-[4px]">
                        <iframe
                          src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(hall.mapQuery)}&z=15`}
                          title={`Карта зала: ${hall.name}`}
                          className="h-full w-full"
                          loading="lazy"
                        />

                        <div className="absolute bottom-3 left-3 rounded-[4px] bg-white/95 px-3 py-2 text-sm leading-4 text-neutral-800 shadow-sm">
                          <p className="font-bold text-black">{hall.name}</p>
                          <p>{hall.address}</p>
                          <a
                            href={`https://yandex.ru/maps/?text=${encodeURIComponent(hall.mapQuery)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1.5 font-bold text-[var(--color-brand-blue)] transition-colors hover:text-[#245ba8]"
                          >
                            Открыть в Яндекс Картах
                            <ExternalLink size={15} strokeWidth={2.3} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="relative min-h-[520px] bg-white" />
        </div>

        </article>

        <img
          src={modalPhoto}
          alt={coach.name}
          className="pointer-events-none absolute bottom-0 right-[-52px] z-20 h-[108%] w-[520px] max-w-none object-contain object-bottom"
        />
      </div>
    </div>
  );
}

export function Coaches() {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const topCoaches = coaches.slice(0, 3);
  const bottomCoaches = coaches.slice(3);

  return (
    <section id="coaches" className="bg-white py-20">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[repeat(5,240px)] lg:justify-between">
          <div className="flex flex-col justify-between lg:col-span-2">
            <div>
              <p className="text-lg font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)]">Команда клуба</p>
              <h2 className="mt-3 text-5xl font-bold uppercase leading-none text-black">Наши тренеры</h2>
              <p className="mt-5 max-w-[430px] text-xl leading-7 text-neutral-800">
                Тренеры клуба «Багратион» - действующие спортсмены и наставники, которые помогают развивать технику, дисциплину и уверенность.
              </p>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="border-l-4 border-[var(--color-brand-red)] bg-[var(--color-brand-bg)] px-4 py-3">
                <div className="text-3xl font-bold leading-none text-black">8</div>
                <div className="mt-1 text-base leading-tight text-neutral-700">тренеров</div>
              </div>

              <div className="border-l-4 border-[var(--color-brand-blue)] bg-[var(--color-brand-bg)] px-4 py-3">
                <div className="text-3xl font-bold leading-none text-black">10+</div>
                <div className="mt-1 text-base leading-tight text-neutral-700">лет опыта</div>
              </div>
            </div>
          </div>

          {topCoaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} onOpen={setSelectedCoach} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(5,240px)] lg:justify-between">
          {bottomCoaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} onOpen={setSelectedCoach} />
          ))}
        </div>
      </div>

      {selectedCoach ? <CoachModal coach={selectedCoach} onClose={() => setSelectedCoach(null)} /> : null}
    </section>
  );
}
