"use client";

import { Award, ExternalLink, MapPin, Trophy, X } from "lucide-react";
import { type ReactNode, useState } from "react";

type ScheduleRow = {
  day: string;
  time: string;
  group: string;
};

type Coach = {
  id: number;
  name: string;
  role: string;
  rank: string;
  photo: string;
  modalPhoto?: string;
  about: string;
  hall: {
    name: string;
    address: string;
    mapQuery: string;
  };
  schedule: ScheduleRow[];
  sportAchievements: string[];
  coachingAchievements: string[];
  personalAchievements: string[];
};

const defaultSchedule: ScheduleRow[] = [
  { day: "Понедельник", time: "18:00 - 19:00", group: "Детская группа" },
  { day: "Среда", time: "18:00 - 19:00", group: "Детская группа" },
];

const armenakSchedule: ScheduleRow[] = [
  { day: "Понедельник", time: "19:00 - 21:00", group: "Взрослые" },
  { day: "Вторник", time: "16:00 - 17:00", group: "Начинающие" },
  { day: "Вторник", time: "17:00 - 18:00", group: "2,3 год обучения" },
  { day: "Четверг", time: "16:00 - 17:00", group: "Начинающие" },
  { day: "Четверг", time: "17:00 - 18:00", group: "2,3 год обучения" },
  { day: "Четверг", time: "20:00 - 22:00", group: "Взрослые" },
];

const coaches: Coach[] = [
  {
    id: 1,
    name: "Бахчиев Арменак",
    role: "Президент региональной физкультурно-спортивной общественной организации",
    rank: "III дан",
    photo: "/images/Armenak_vin.png",
    modalPhoto: "/images/Armenak_kick.png",
    about:
      "Тренер клуба «Багратион», педагог дополнительного образования и наставник спортсменов. Работает с детьми и взрослыми, готовит учеников к аттестациям, соревнованиям и учебно-тренировочным сборам.",
    hall: {
      name: "Зал Арменака Александровича",
      address: "Москва, ул. Тимирязевская, 16",
      mapQuery: "Москва, улица Тимирязевская, 16",
    },
    schedule: armenakSchedule,
    sportAchievements: [
      "Чемпион Москвы 2016 (Шинкиокушин)",
      "Серебряный призер Чемпионата Москвы 2017 (Шинкиокушин)",
      "Серебряный призер Чемпионата ЦФО 2014 (Кекусин-кан)",
      "Серебряный призер Международного турнира «Кубок Полесья» (KWU)",
      "Чемпион Московской области 2007 (ИКО)",
    ],
    coachingAchievements: [
      "Воспитал победителей первенств Москвы и Московской области 2012-2019 (КАН, ШИН, ИКО, ИФК)",
      "Воспитал победителей первенств ЦФО 2014-2017 (Мацушима, КАН, ШИН)",
      "Воспитал победителя и призера Первенства России 2014, 2016 (КАН, ШИН)",
      "Воспитал победителей Первенства России 2018 (Ико-Мацушима)",
      "Воспитал серебряного и бронзового призеров Первенства Китая 2018",
      "Воспитал бронзовых призеров Первенства Европы 2018 (ИФК)",
      "Воспитал бронзового призера Первенства Европы 2015 (KWU)",
      "Воспитал серебряного призера Первенства Европы 2015 (Ренгокай)",
      "Воспитал победителей Первенства России 2020 (СО-Киокушин)",
      "Воспитал победителей Всероссийского турнира Кубок КВФ 2021-2022",
      "Воспитал чемпиона России по Ашихара каратэ и призеров всероссийских первенств, Чемпиона Москвы среди студентов",
    ],
    personalAchievements: [
      "Педагог дополнительного образования высшей категории, учитель физической культуры высшей категории",
      "Награжден грамотой департамента образования г. Москвы",
      "Грамота от партии Единая Россия за реализацию проекта «Детский спорт»",
      "Благодарность министра спорта респ. Дагестан",
      "Благодарность министра спорта респ. Чувашии",
      "Благодарность международной ассоциации ветеранов подразделения антитеррора «Альфа»",
    ],
  },
  {
    id: 2,
    name: "Иванова Елизавета",
    role: "Тренер детских групп",
    rank: "I дан",
    photo: "/images/Elisaveta_vin.png",
    about:
      "Ведет группы начальной подготовки, уделяет внимание базовой технике, координации и безопасной нагрузке.",
    hall: { name: "Зал детских групп", address: "Москва, ул. Яблочкова, 7", mapQuery: "Москва, улица Яблочкова, 7" },
    schedule: defaultSchedule,
    sportAchievements: ["Черный пояс, I дан", "Участница региональных соревнований"],
    coachingAchievements: ["Работа с начинающими спортсменами", "Подготовка детей к первым аттестациям"],
    personalAchievements: ["Опыт работы с детскими группами", "Участница учебно-тренировочных сборов"],
  },
  {
    id: 3,
    name: "Медведев Михаил",
    role: "Старший тренер",
    rank: "III дан",
    photo: "/images/Mihail_vin.png",
    modalPhoto: "/images/Mihail_kick.png",
    about:
      "Работает с группами разного уровня, выстраивает тренировочный процесс и подготовку к аттестациям.",
    hall: { name: "Основной зал", address: "Москва, ул. Жасминовая, 10", mapQuery: "Москва, улица Жасминовая, 10" },
    schedule: defaultSchedule,
    sportAchievements: ["Черный пояс, III дан", "Опыт выступлений и судейства"],
    coachingAchievements: ["Подготовка спортсменов к поясам", "Методическая работа с группами"],
    personalAchievements: ["Опыт тренерской работы", "Участник клубных мероприятий"],
  },
  {
    id: 4,
    name: "Улещенко Андрей",
    role: "Тренер групп начальной подготовки",
    rank: "I дан",
    photo: "/images/Andrei_vin.png",
    about:
      "Помогает новичкам освоить базовые стойки, удары, перемещения и правила безопасной работы в паре.",
    hall: { name: "Зал начальной подготовки", address: "Москва, ул. Яблочкова, 7", mapQuery: "Москва, улица Яблочкова, 7" },
    schedule: defaultSchedule,
    sportAchievements: ["Черный пояс, I дан", "Участник клубных сборов"],
    coachingAchievements: ["Адаптация новичков", "Подготовка к первым соревнованиям"],
    personalAchievements: ["Опыт работы с новичками", "Участник учебно-тренировочных сборов"],
  },
  {
    id: 5,
    name: "Абержав Адель",
    role: "Тренер по общей и специальной подготовке",
    rank: "I дан",
    photo: "/images/Adel_vin.png",
    modalPhoto: "/images/Adel_kick.png",
    about:
      "Развивает у учеников выносливость, силу, координацию и базовые навыки для дальнейшего роста.",
    hall: { name: "Зал ОФП", address: "Апрелевка, ул. Августовская, 14", mapQuery: "Апрелевка, улица Августовская, 14" },
    schedule: defaultSchedule,
    sportAchievements: ["Черный пояс, I дан", "Опыт соревновательной подготовки"],
    coachingAchievements: ["Развитие физической базы учеников", "Подготовка к сборам"],
    personalAchievements: ["Опыт работы с группами ОФП", "Участник клубной команды"],
  },
  {
    id: 6,
    name: "Лушкина Вера",
    role: "Тренер детских и подростковых групп",
    rank: "I дан",
    photo: "/images/Vera_vin.png",
    modalPhoto: "/images/Vera_kick.png",
    about:
      "Работает с дисциплиной, техникой и вниманием к деталям, помогает ученикам проходить первые этапы обучения.",
    hall: { name: "Зал подростковых групп", address: "Москва, ул. Тимирязевская, 16", mapQuery: "Москва, улица Тимирязевская, 16" },
    schedule: defaultSchedule,
    sportAchievements: ["Черный пояс, I дан", "Участница учебно-тренировочных сборов"],
    coachingAchievements: ["Подготовка детей к аттестациям", "Работа с техникой начального уровня"],
    personalAchievements: ["Опыт работы с подростками", "Участница спортивных мероприятий клуба"],
  },
  {
    id: 7,
    name: "Хасянов Рустам",
    role: "Тренер взрослых групп",
    rank: "I дан",
    photo: "/images/Rustam_vin.png",
    modalPhoto: "/images/Rustam_kick.png",
    about:
      "Ведет тренировки для взрослых, сочетает техническую подготовку, ОФП и постепенное развитие нагрузки.",
    hall: { name: "Зал взрослых групп", address: "Москва, ул. Жасминовая, 10", mapQuery: "Москва, улица Жасминовая, 10" },
    schedule: defaultSchedule,
    sportAchievements: ["Черный пояс, I дан", "Опыт подготовки взрослых учеников"],
    coachingAchievements: ["Работа со взрослыми новичками", "Подготовка к аттестациям"],
    personalAchievements: ["Опыт работы со взрослыми группами", "Участник клубных сборов"],
  },
  {
    id: 8,
    name: "Кураш Анастасия",
    role: "Тренер младших групп",
    rank: "Кандидатский уровень",
    photo: "/images/Anastasia_vin.png",
    about:
      "Помогает младшим ученикам привыкнуть к тренировочному режиму, развивает внимательность и базовую технику.",
    hall: { name: "Зал младших групп", address: "Москва, ул. Яблочкова, 7", mapQuery: "Москва, улица Яблочкова, 7" },
    schedule: defaultSchedule,
    sportAchievements: ["Опыт выступлений в детско-юношеских соревнованиях", "Участница клубной команды"],
    coachingAchievements: ["Работа с младшими группами", "Помощь в подготовке к первым стартам"],
    personalAchievements: ["Опыт работы с младшими группами", "Участница спортивной жизни клуба"],
  },
];

function CoachCard({ coach, onOpen }: { coach: Coach; onOpen: (coach: Coach) => void }) {
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

      <div className="bg-white px-3 py-2.5 text-center">
        <h3 className="text-lg font-normal leading-tight text-black">{coach.name}</h3>

        <button
          type="button"
          onClick={() => onOpen(coach)}
          className="mt-2 w-full cursor-pointer rounded-[6px] bg-[var(--color-brand-bg)] px-3 py-1.5 text-sm font-medium text-[var(--color-brand-blue)] transition-colors hover:bg-[var(--color-brand-blue)] hover:text-white"
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

function ScheduleTable({ rows }: { rows: ScheduleRow[] }) {
  return (
    <div className="overflow-hidden rounded-[4px] border border-neutral-200">
      <table className="w-full border-collapse bg-white text-left text-base">
        <thead className="bg-[var(--color-brand-bg)] text-black">
          <tr>
            <th className="border border-neutral-200 px-4 py-3 font-bold">День</th>
            <th className="border border-neutral-200 px-4 py-3 font-bold">Время</th>
            <th className="border border-neutral-200 px-4 py-3 font-bold">Группа</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.day}-${row.time}-${index}`}>
              <td className="border border-neutral-200 px-4 py-3">{row.day}</td>
              <td className="border border-neutral-200 px-4 py-3">{row.time}</td>
              <td className="border border-neutral-200 px-4 py-3">{row.group}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoachModal({ coach, onClose }: { coach: Coach; onClose: () => void }) {
  const [activePanel, setActivePanel] = useState<CoachPanel | null>(null);
  const mapSrc = `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(coach.hall.mapQuery)}&z=15`;
  const modalPhoto = coach.modalPhoto ?? coach.photo;

  function togglePanel(panel: CoachPanel) {
    setActivePanel((currentPanel) => (currentPanel === panel ? null : panel));
  }

  function renderActivePanel() {
    if (activePanel === "schedule") {
      return (
        <div>
          <h4 className="mb-4 flex items-center gap-2 text-2xl font-bold leading-tight text-black">
            <MapPin size={24} className="text-[var(--color-brand-blue)]" />
            Расписание
          </h4>
          <ScheduleTable rows={coach.schedule} />
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
              <PanelButton label="Тренерские достижения" isActive={activePanel === "coaching"} onClick={() => togglePanel("coaching")} />
              <PanelButton label="Спортивные достижения" isActive={activePanel === "sport"} onClick={() => togglePanel("sport")} />
              <PanelButton label="Личные достижения" isActive={activePanel === "personal"} onClick={() => togglePanel("personal")} />
              <PanelButton label="Расписание" isActive={activePanel === "schedule"} onClick={() => togglePanel("schedule")} />
            </div>

            <div className="relative mt-4 h-[420px] rounded-[4px] border border-neutral-200 bg-[var(--color-brand-bg)] p-2">
              {activePanel ? (
                <div className="h-full overflow-y-auto rounded-[4px] bg-white p-6">
                  {renderActivePanel()}
                </div>
              ) : (
                <>
                  <div className="relative h-full overflow-hidden rounded-[4px]">
                    <iframe src={mapSrc} title={`Карта зала: ${coach.name}`} className="h-full w-full" loading="lazy" />

                    <div className="absolute bottom-5 left-5 rounded-[4px] bg-white/95 px-4 py-3 text-base leading-5 text-neutral-800 shadow-sm">
                      <p className="font-bold text-black">{coach.hall.name}</p>
                      <p>{coach.hall.address}</p>
                      <a
                        href={`https://yandex.ru/maps/?text=${encodeURIComponent(coach.hall.mapQuery)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-2 font-bold text-[var(--color-brand-blue)] transition-colors hover:text-[#245ba8]"
                      >
                        Открыть в Яндекс Картах
                        <ExternalLink size={17} strokeWidth={2.3} />
                      </a>
                    </div>
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
