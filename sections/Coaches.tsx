"use client";

import { Award, MapPin, Trophy, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import {
  LocalInteractiveMap,
  type LocalMapLocation,
  type MapBounds,
} from "@/components/LocalInteractiveMap";

type ScheduleRow = {
  day: string;
  time: string;
  group?: string;
};

type ScheduleSection = {
  title?: string;
  rows: ScheduleRow[];
};

type Hall = LocalMapLocation;

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
  hall: Hall;
  additionalHalls?: Hall[];
  schedules: ScheduleSection[];
  sportAchievements: string[];
  coachingAchievements: string[];
  personalAchievements: string[];
};

const timiryazevskayaBounds: MapBounds = {
  minLat: 55.8045,
  maxLat: 55.8218,
  minLon: 37.546,
  maxLon: 37.582,
};

const lobnyaBounds: MapBounds = {
  minLat: 56.008,
  maxLat: 56.019,
  minLon: 37.47,
  maxLon: 37.49,
};

const vernadskogoBounds: MapBounds = {
  minLat: 55.644,
  maxLat: 55.6622,
  minLon: 37.455,
  maxLon: 37.4895,
};

const raspletinaBounds: MapBounds = {
  minLat: 55.7805,
  maxLat: 55.799,
  minLon: 37.462,
  maxLon: 37.497,
};

const aprelevkaBounds: MapBounds = {
  minLat: 55.526,
  maxLat: 55.5615,
  minLon: 37.053,
  maxLon: 37.081,
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
      point: { lat: 55.812663, lon: 37.560307 },
      dataFile: "/maps/timiryazevskaya.osm.json",
      bounds: timiryazevskayaBounds,
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
      "Воспитал победителя чемпионата Японии (Накамура) 2026",
      "Воспитал победителей первенств Москвы и Московской области 2024–2026 (ФКР)",
      "Воспитал победителей и призеров всероссийских соревнований 2024–2026 (ФКР)",
      "Воспитал победителей первенств Москвы и Московской области 2012–2026 (КАН, ШИН, ИКО, ИФК)",
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
    hall: {
      name: "Зал в Москве",
      address: "Москва, ул. Тимирязевская, д. 16",
      mapQuery: "Москва, улица Тимирязевская, 16",
      point: { lat: 55.81412, lon: 37.566656 },
      dataFile: "/maps/timiryazevskaya.osm.json",
      bounds: timiryazevskayaBounds,
    },
    additionalHalls: [
      {
        name: "Зал в Лобне",
        address: "Московская область, Лобня, ул. Чехова, 3А",
        mapQuery: "Московская область, Лобня, улица Чехова, 3А",
        point: { lat: 56.013814, lon: 37.479843 },
        dataFile: "/maps/lobnya.osm.json",
        bounds: lobnyaBounds,
      },
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
      "Серебряный призер чемпионата Японии (Накамура) 2026",
      "Победитель чемпионата ЦФО (ката-группа)",
      "Серебряный призёр Кубка мира",
      "Бронзовый призёр чемпионата Европы",
      "Бронзовый призёр Кубка столицы",
    ],
    coachingAchievements: [
      "Воспитал победителей первенств Москвы и Московской области 2024–2026 (ФКР)",
      "Воспитал победителей и призеров всероссийских соревнований 2024–2026 (ФКР)",
      "Воспитал победителей первенств Москвы 2021–2026",
      "Воспитал победителей первенств Московской области 2020–2026",
      "Воспитал победителей и призёров всероссийских соревнований 2022–2026",
    ],
    personalAchievements: [],
  },
  {
    id: 3,
    name: "Аберхаев Адель Айсяевич",
    role: "Тренер-преподаватель Московской областной федерации киокушин",
    rank: "II дан, КМС",
    photo: "/images/Adel_vin.png",
    modalPhoto: "/images/Adel_kick.png",
    about:
      "Тренер-преподаватель, кандидат в мастера спорта. Проводит занятия для младшей и старшей детских групп.",
    cardAddress: "проспект Вернадского, 94к7",
    transit: { label: "метро Тропарёво", color: "#E42313" },
    hall: {
      name: "Зал на проспекте Вернадского",
      address: "Москва, проспект Вернадского, 94к7",
      mapQuery: "Москва, проспект Вернадского, 94к7",
      point: { lat: 55.653096, lon: 37.472216 },
      dataFile: "/maps/vernadskogo.osm.json",
      bounds: vernadskogoBounds,
    },
    additionalHalls: [
      {
        name: "ГБОУ Школа № 1454 «Тимирязевская»",
        address: "Москва, Дмитровское шоссе, д. 15, корп. 3",
        mapQuery: "Москва, Дмитровское шоссе, 15к3, ГБОУ Школа № 1454 Тимирязевская",
        point: { lat: 55.818574, lon: 37.571516 },
        dataFile: "/maps/timiryazevskaya.osm.json",
        bounds: timiryazevskayaBounds,
      },
    ],
    schedules: [
      {
        title: "Проспект Вернадского, 94к7",
        rows: [
          { day: "Вторник", time: "17:00–18:00", group: "Младшая группа, 6–8 лет" },
          { day: "", time: "18:00–19:00", group: "Старшая группа, 8–15 лет" },
          { day: "Четверг", time: "17:00–18:00", group: "Младшая группа, 6–8 лет" },
          { day: "", time: "18:00–19:00", group: "Старшая группа, 8–15 лет" },
          { day: "Суббота", time: "17:00–18:00", group: "Младшая группа, 6–8 лет" },
          { day: "", time: "18:00–19:00", group: "Старшая группа, 8–15 лет" },
        ],
      },
      {
        title: "Дмитровское шоссе, 15к3",
        rows: [
          { day: "Понедельник", time: "17:00–18:30" },
          { day: "", time: "18:30–20:00" },
          { day: "Среда", time: "17:00–18:30" },
          { day: "", time: "18:30–20:00" },
          { day: "Пятница", time: "17:00–18:30" },
          { day: "", time: "18:30–20:00" },
        ],
      },
    ],
    sportAchievements: [
      "Призёр Кубка Содружества",
      "Чемпион России 2021",
      "Серебряный призёр чемпионата Европы 2022",
    ],
    coachingAchievements: [
      "Воспитал победителей первенств Москвы и Московской области 2024–2026 (ФКР)",
      "Воспитал призёров первенств Москвы 2021–2026",
      "Воспитал призёров первенств Московской области 2020–2026",
      "Воспитал призёров всероссийских соревнований 2022–2026",
    ],
    personalAchievements: [],
  },
  {
    id: 4,
    name: "Улещенко Андрей Андреевич",
    role: "Тренер-преподаватель Московской областной федерации киокушин",
    rank: "I дан, МСМК",
    photo: "/images/Andrei_vin.png",
    modalPhoto: "/images/Andrei_kick.png",
    about:
      "Мастер спорта международного класса по карате киокушинкай. Более десяти лет работает детским тренером.",
    cardAddress: "ул. Расплетина, 1",
    transit: { label: "метро Октябрьское Поле", color: "#8E479C" },
    hall: {
      name: "Зал на улице Расплетина",
      address: "Москва, ул. Расплетина, 1",
      mapQuery: "Москва, улица Расплетина, 1",
      point: { lat: 55.789795, lon: 37.479618 },
      dataFile: "/maps/raspletina.osm.json",
      bounds: raspletinaBounds,
    },
    schedules: [
      {
        rows: [
          { day: "Понедельник", time: "17:00–18:00" },
          { day: "", time: "18:00–19:00" },
          { day: "", time: "19:00–20:00" },
          { day: "Вторник", time: "18:00–19:00" },
          { day: "", time: "19:00–20:00" },
          { day: "Среда", time: "17:00–18:00" },
          { day: "", time: "18:00–19:00" },
          { day: "", time: "19:00–20:00" },
          { day: "Четверг", time: "18:00–19:00" },
          { day: "", time: "19:00–20:00" },
          { day: "Пятница", time: "17:00–18:00" },
          { day: "", time: "18:00–19:00" },
          { day: "", time: "19:00–20:00" },
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
    hall: {
      name: "Зал на Жасминовой улице",
      address: "Апрелевка, ул. Жасминовая, д. 10",
      mapQuery: "Московская область, Апрелевка, улица Жасминовая, 10",
      point: { lat: 55.53182, lon: 37.060599 },
      dataFile: "/maps/aprelevka.osm.json",
      bounds: aprelevkaBounds,
    },
    schedules: [
      {
        rows: [
          { day: "Понедельник", time: "15:00–16:00" },
          { day: "", time: "16:00–18:00" },
          { day: "Среда", time: "15:00–16:00" },
          { day: "", time: "16:00–18:00" },
          { day: "Пятница", time: "16:00–18:00" },
        ],
      },
    ],
    sportAchievements: ["Призёр Кубка Содружества"],
    coachingAchievements: [
      "Воспитал победителей первенств Москвы и Московской области 2024–2026 (ФКР)",
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
    modalPhoto: "/images/Anastasia_kick.png",
    about:
      "Педагог по физической культуре и спорту. Проводит занятия для младших и старших групп в Апрелевке и Изварино.",
    cardAddress: "Апрелевка, ул. Августовская, 14",
    transit: { label: "МЦД-4 Апрелевка", color: "#40B7AD" },
    hall: {
      name: "Зал на Августовской улице",
      address: "Апрелевка, ул. Августовская, 14",
      mapQuery: "Московская область, Апрелевка, Августовская улица, 14",
      point: { lat: 55.549816, lon: 37.068441 },
      dataFile: "/maps/aprelevka.osm.json",
      bounds: aprelevkaBounds,
    },
    additionalHalls: [
      {
        name: "Зал на Жасминовой улице",
        address: "Апрелевка, ул. Жасминовая, 9",
        mapQuery: "Московская область, Апрелевка, Жасминовая улица, 9",
        point: { lat: 55.530566, lon: 37.060743 },
        dataFile: "/maps/aprelevka.osm.json",
        bounds: aprelevkaBounds,
      },
      {
        name: "Зал на Парковой улице",
        address: "Апрелевка, ул. Парковая, 8/3",
        mapQuery: "Московская область, Апрелевка, Парковая улица, 8/3",
        point: { lat: 55.556569, lon: 37.073059 },
        dataFile: "/maps/aprelevka.osm.json",
        bounds: aprelevkaBounds,
      },
      {
        name: "Зал на улице Самохина",
        address: "Апрелевка, ул. Самохина, 9",
        mapQuery: "Московская область, Апрелевка, улица Самохина, 9",
        point: { lat: 55.550876, lon: 37.06183 },
        dataFile: "/maps/aprelevka.osm.json",
        bounds: aprelevkaBounds,
      },
    ],
    schedules: [
      {
        title: "Апрелевка",
        rows: [
          { day: "Понедельник", time: "16:00–16:30", group: "Жасминовая, 9 — 4+" },
          { day: "", time: "17:30–18:00", group: "Парковая, 8/3 — 4+" },
          { day: "", time: "18:00–19:00", group: "Августовская, 14 — младшая 4+" },
          { day: "", time: "18:00–19:00", group: "Августовская, 14 — старшая 7+" },
          { day: "Среда", time: "16:00–16:30", group: "Жасминовая, 9 — 4+" },
          { day: "", time: "17:30–18:00", group: "Самохина, 9 — 4+" },
          { day: "", time: "18:00–19:00", group: "Августовская, 14 — младшая 4+" },
          { day: "", time: "18:00–19:00", group: "Августовская, 14 — старшая 7+" },
          { day: "Пятница", time: "16:00–16:30", group: "Парковая, 8/3 — 4+" },
          { day: "", time: "17:30–18:00", group: "Самохина, 9 — 4+" },
          { day: "", time: "18:00–19:00", group: "Августовская, 14 — старшая 7+" },
        ],
      },
      {
        title: "Изварино",
        rows: [
          { day: "Понедельник", time: "10:00–11:00", group: "Старшая группа" },
          { day: "Вторник", time: "17:00–18:00", group: "Младшая группа" },
          { day: "", time: "18:00–19:00", group: "Старшая группа" },
          { day: "Среда", time: "10:00–11:00", group: "Старшая группа" },
          { day: "Четверг", time: "17:00–18:00", group: "Младшая группа" },
          { day: "", time: "18:00–19:00", group: "Старшая группа" },
          { day: "Пятница", time: "10:00–11:00", group: "Старшая группа" },
          { day: "Суббота", time: "12:00–13:00", group: "Старшая группа" },
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
    modalPhoto: "/images/Elisaveta_kick.png",
    about:
      "Мастер спорта по киокусинкай, спортивный судья второй категории. Тренерский стаж — семь лет.",
    cardAddress: "ул. Тимирязевская, д. 16",
    transit: { label: "метро Тимирязевская", color: "#A1A2A3" },
    hall: {
      name: "Зал на Тимирязевской",
      address: "Москва, ул. Тимирязевская, д. 16",
      mapQuery: "Москва, улица Тимирязевская, 16",
      point: { lat: 55.814142763938754, lon: 37.566691924265655 },
      dataFile: "/maps/timiryazevskaya.osm.json",
      bounds: timiryazevskayaBounds,
    },
    schedules: [
      {
        title: "ОФП с элементами карате, 4+",
        rows: [
          { day: "Вторник", time: "17:30–18:30" },
          { day: "Четверг", time: "17:30–18:30" },
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
    coachingAchievements: [
      "Стаж тренерской работы — 7 лет",
      "Воспитал победителей первенств Москвы и Московской области 2024–2026 (ФКР)",
      "Воспитал победителей и призеров всероссийских соревнований 2024–2026 (ФКР)",
    ],
    personalAchievements: [
      "Российский государственный университет физической культуры и спорта — тренер по киокусинкай",
      "МГИМО — международные отношения в спорте",
      "Мастер спорта по киокусинкай",
      "Мастер спорта по киокушин",
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
    hall: {
      name: "АПИА Арена",
      address: "Москва, ул. Яблочкова, д. 7",
      mapQuery: "Москва, улица Яблочкова, 7",
      point: { lat: 55.816702, lon: 37.57925 },
      dataFile: "/maps/timiryazevskaya.osm.json",
      bounds: timiryazevskayaBounds,
    },
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
    <article
      id={coach.id === 8 ? "coach-rustam" : undefined}
      className="w-full min-w-0 self-start scroll-mt-6 overflow-hidden rounded-[4px] border border-neutral-200 bg-white shadow-sm lg:w-full min-[1360px]:w-[240px]"
    >
      <div
        className="relative aspect-[240/295] overflow-hidden bg-[var(--color-brand-bg)] bg-top bg-no-repeat"
        style={{
          backgroundImage: "url('/images/logo_coaches.png')",
          backgroundSize: "100% auto",
        }}
      >
        <img src={coach.photo} alt={coach.name} className="absolute bottom-0 left-0 z-10 w-full" />
      </div>

      <div className="h-[108px] bg-white px-2 py-2 text-center sm:h-[112px] sm:px-3">
        <h3 className="truncate text-xs font-bold leading-5 text-black sm:text-base sm:font-medium">{shortName}</h3>

        <div className="mt-1 flex h-8 items-center justify-center gap-1.5 text-left text-[10px] leading-[13px] text-neutral-600 sm:gap-2 sm:text-[11px] sm:leading-[14px]">
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
          className="mt-1.5 min-h-8 w-full cursor-pointer rounded-[6px] bg-[var(--color-brand-bg)] px-2 py-1 text-xs font-bold text-[var(--color-brand-blue)] transition-colors hover:bg-[var(--color-brand-blue)] hover:text-white sm:px-3 sm:py-1.5 sm:text-sm sm:font-medium"
        >
          <span className="sm:hidden">Подробнее</span>
          <span className="hidden sm:inline">Открыть информацию</span>
        </button>
      </div>
    </article>
  );
}

type CoachPanel = "coaching" | "sport" | "personal" | "schedule";

function InfoList({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) {
  return (
    <div className="h-full overflow-hidden">
      <h4 className="flex items-center gap-1.5 text-base font-bold leading-tight text-black sm:gap-2 sm:text-xl lg:text-2xl">
        {icon}
        {title}
      </h4>

      <ul className="mt-2 grid grid-cols-1 gap-y-1.5 text-xs leading-4 text-neutral-800 sm:text-sm sm:leading-[18px] lg:mt-4 lg:gap-y-2 lg:text-base lg:leading-5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 lg:gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-red)] lg:mt-2" />
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
        "min-h-9 rounded-[6px] px-2 py-1.5 text-[11px] font-bold leading-tight sm:min-h-10 sm:px-4 sm:py-2 sm:text-sm lg:min-h-11 lg:px-5 lg:text-lg",
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
  const hasLongGroups = rows.some((row) => (row.group?.length ?? 0) > 24);
  const density = rows.length > 9 ? "dense" : compact ? "medium" : "large";
  const tableTextClass =
    density === "large"
      ? "text-xs leading-4 sm:text-sm sm:leading-5 lg:text-[17px] lg:leading-6"
      : density === "medium"
        ? "text-[11px] leading-[15px] sm:text-xs sm:leading-4 lg:text-sm lg:leading-5"
        : "text-[10px] leading-[13px] sm:text-[11px] sm:leading-[14px] lg:text-[13px] lg:leading-4";
  const cellClass =
    density === "large"
      ? "px-2 py-1 sm:px-3 lg:py-1.5"
      : density === "medium"
        ? "px-1.5 py-0.5 sm:px-2 lg:py-1"
        : "px-1 py-px sm:px-1.5 lg:py-0.5";
  const dayWidthClass = hasGroups
    ? hasLongGroups
      ? "w-[24%]"
      : "w-[30%]"
    : "w-[40%]";
  const timeWidthClass = hasGroups
    ? hasLongGroups
      ? "w-[25%]"
      : "w-[35%]"
    : "";

  return (
    <div className="overflow-hidden rounded-[4px] border border-neutral-200">
      <table className={`w-full table-fixed border-collapse bg-white text-left ${tableTextClass}`}>
        <thead className="bg-[var(--color-brand-bg)] text-black">
          <tr>
            <th className={`${dayWidthClass} ${cellClass} whitespace-nowrap border border-neutral-200 font-bold`}>День</th>
            <th className={`${timeWidthClass} ${cellClass} whitespace-nowrap border border-neutral-200 font-bold`}>Время</th>
            {hasGroups ? <th className={`${cellClass} whitespace-nowrap border border-neutral-200 font-bold`}>Группа / адрес</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.day}-${row.time}-${index}`}>
              <td className={`${cellClass} whitespace-nowrap border border-neutral-200 align-top font-medium`}>{row.day}</td>
              <td className={`${cellClass} whitespace-nowrap border border-neutral-200 align-top`}>{row.time}</td>
              {hasGroups ? <td className={`${cellClass} whitespace-nowrap border border-neutral-200 align-top`}>{row.group}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoachMaps({ halls, combineLocations = false }: { halls: Hall[]; combineLocations?: boolean }) {
  const [activeHallIndex, setActiveHallIndex] = useState(0);
  const layoutClass =
    halls.length === 1
      ? "lg:grid-cols-1"
      : halls.length === 2
        ? "lg:grid-cols-2 lg:grid-rows-1"
        : "lg:grid-cols-2 lg:grid-rows-2";

  if (combineLocations) {
    return <LocalInteractiveMap location={halls[0]} locations={halls} />;
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-col lg:hidden">
        {halls.length > 1 ? (
          <div className="scrollbar-hidden mb-1.5 flex shrink-0 gap-1 overflow-x-auto">
            {halls.map((hall, index) => (
              <button
                key={`${hall.point.lat}-${hall.point.lon}-tab`}
                type="button"
                onClick={() => setActiveHallIndex(index)}
                className={[
                  "min-h-8 min-w-[calc(50%_-_2px)] shrink-0 truncate rounded-[4px] px-2 text-[10px] font-bold",
                  index === activeHallIndex
                    ? "bg-[var(--color-brand-blue)] text-white"
                    : "bg-white text-[var(--color-brand-blue)]",
                ].join(" ")}
              >
                {hall.address}
              </button>
            ))}
          </div>
        ) : null}

        <div className="min-h-0 flex-1">
          <LocalInteractiveMap
            key={`${halls[activeHallIndex].point.lat}-${halls[activeHallIndex].point.lon}`}
            location={halls[activeHallIndex]}
            compact={halls.length > 1}
          />
        </div>
      </div>

      <div
        className={[
          `hidden h-full gap-3 lg:grid ${layoutClass}`,
          halls.length === 2 ? "items-center" : "items-stretch",
        ].join(" ")}
      >
        {halls.map((hall) => (
          <div
            key={`${hall.point.lat}-${hall.point.lon}`}
            className={
              halls.length === 2
                ? "flex min-h-0 items-center justify-center"
                : "h-full min-h-0"
            }
          >
            {halls.length === 2 ? (
              <div className="aspect-square w-full max-w-[420px]">
                <LocalInteractiveMap location={hall} compact />
              </div>
            ) : (
              <LocalInteractiveMap location={hall} compact={halls.length > 1} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function CoachModal({ coach, onClose }: { coach: Coach; onClose: () => void }) {
  const [activePanel, setActivePanel] = useState<CoachPanel | null>(null);
  const [activeScheduleIndex, setActiveScheduleIndex] = useState(0);
  const halls = [coach.hall, ...(coach.additionalHalls ?? [])];
  const modalPhoto = coach.modalPhoto ?? coach.photo;
  const modalPhotoSizeClass =
    coach.id === 7
      ? "right-[-70px] h-[118%] w-[680px]"
      : coach.id === 4 || coach.id === 6
        ? "right-[-62px] h-[114%] w-[570px]"
        : "right-[-52px] h-[108%] w-[520px]";
  const achievementButtonCount = [
    coach.coachingAchievements,
    coach.sportAchievements,
    coach.personalAchievements,
  ].filter((items) => items.length > 0).length;
  const panelButtonCount = achievementButtonCount + 1;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function togglePanel(panel: CoachPanel) {
    setActivePanel((currentPanel) => (currentPanel === panel ? null : panel));
  }

  function renderActivePanel() {
    if (activePanel === "schedule") {
      const useAdaptiveScheduleLayout =
        (coach.id === 2 || coach.id === 3 || coach.id === 6) && coach.schedules.length > 1;

      return (
        <div className="flex h-full min-h-0 flex-col">
          <h4 className="mb-2 flex shrink-0 items-center gap-1.5 text-base font-bold leading-tight text-black sm:text-lg lg:mb-3 lg:gap-2 lg:text-2xl">
            <MapPin size={18} className="text-[var(--color-brand-blue)] lg:h-[21px] lg:w-[21px]" />
            Расписание
          </h4>

          {useAdaptiveScheduleLayout ? (
            <>
              <div className="mb-2 grid shrink-0 grid-cols-2 gap-1.5 lg:hidden">
                {coach.schedules.map((schedule, index) => (
                  <button
                    key={`${schedule.title ?? "schedule"}-${index}-tab`}
                    type="button"
                    onClick={() => setActiveScheduleIndex(index)}
                    className={[
                      "min-h-9 rounded-[4px] px-2 text-xs font-bold transition-colors sm:text-sm",
                      activeScheduleIndex === index
                        ? "bg-[var(--color-brand-blue)] text-white"
                        : "bg-[var(--color-brand-bg)] text-[var(--color-brand-blue)]",
                    ].join(" ")}
                    aria-pressed={activeScheduleIndex === index}
                  >
                    {schedule.title ?? `Расписание ${index + 1}`}
                  </button>
                ))}
              </div>

              <section className="min-h-0 lg:hidden">
                <ScheduleTable rows={coach.schedules[activeScheduleIndex].rows} compact />
              </section>

              <div className="hidden min-h-0 grid-cols-2 items-start gap-3 lg:grid">
                {coach.schedules.map((schedule, index) => (
                  <section key={`${schedule.title ?? "schedule"}-${index}`} className="min-w-0">
                    <h5 className="mb-1.5 text-base font-bold leading-tight text-[var(--color-brand-blue)]">
                      {schedule.title ?? `Расписание ${index + 1}`}
                    </h5>
                    <ScheduleTable rows={schedule.rows} compact />
                  </section>
                ))}
              </div>
            </>
          ) : (
            <div className={coach.schedules.length > 1 ? "space-y-2 lg:space-y-3" : ""}>
              {coach.schedules.map((schedule, index) => (
                <section key={`${schedule.title ?? "schedule"}-${index}`}>
                  {schedule.title ? (
                    <h5 className="mb-1 text-xs font-bold leading-tight text-[var(--color-brand-blue)] sm:text-sm lg:mb-1.5 lg:text-base">{schedule.title}</h5>
                  ) : null}
                  <ScheduleTable rows={schedule.rows} compact={coach.schedules.length > 1} />
                </section>
              ))}
            </div>
          )}
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-0 sm:p-5 lg:p-8">
      <div className="relative h-full w-full max-w-[1320px] sm:h-[calc(100dvh-40px)] lg:h-[min(740px,calc(100dvh-64px))]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-40 flex h-11 w-11 items-center justify-center rounded-[4px] bg-white text-black shadow-md transition-colors hover:bg-[var(--color-brand-bg)] sm:right-5 sm:top-5"
          aria-label="Закрыть окно тренера"
        >
          <X size={28} />
        </button>

        <article className="relative h-full overflow-hidden bg-white shadow-2xl sm:rounded-[4px]">
          <div className="grid h-full grid-cols-1 bg-white lg:grid-cols-[1fr_440px]">
            <div className="coach-modal-body flex h-full min-h-0 min-w-0 flex-col px-3 pb-3 pt-14 sm:p-5 lg:p-7">
              <div className="shrink-0">
                <p className="coach-modal-eyebrow hidden text-sm font-medium uppercase leading-none tracking-[0.12em] text-[var(--color-brand-blue)] sm:block sm:text-base">Тренер клуба</p>

                <h3 className="pr-10 text-xl font-bold uppercase leading-tight text-black sm:mt-2 sm:pr-12 sm:text-2xl lg:text-4xl lg:leading-none">{coach.name}</h3>

                <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] font-medium sm:mt-3 sm:gap-2 sm:text-xs lg:text-sm">
                  <span className="coach-modal-role hidden bg-[var(--color-brand-bg)] px-3 py-1.5 leading-5 text-[var(--color-brand-blue)] sm:inline">{coach.role}</span>
                  <span className="bg-[var(--color-brand-bg)] px-2 py-1 leading-4 text-[var(--color-brand-red)] sm:px-3 sm:py-1.5 sm:leading-5">{coach.rank}</span>
                </div>

                <p className="coach-modal-about mt-1.5 line-clamp-2 max-w-[760px] text-[10px] leading-[14px] text-neutral-800 sm:mt-3 sm:text-sm sm:leading-5 lg:text-base">{coach.about}</p>
              </div>

              <div className="mt-2 grid shrink-0 grid-cols-2 gap-1.5 sm:mt-4 sm:gap-2 lg:mt-5 lg:gap-3">
                {coach.coachingAchievements.length > 0 ? <PanelButton label="Тренерские достижения" isActive={activePanel === "coaching"} onClick={() => togglePanel("coaching")} /> : null}
                {coach.sportAchievements.length > 0 ? <PanelButton label="Спортивные достижения" isActive={activePanel === "sport"} onClick={() => togglePanel("sport")} /> : null}
                {coach.personalAchievements.length > 0 ? <PanelButton label="Личные достижения" isActive={activePanel === "personal"} onClick={() => togglePanel("personal")} /> : null}
                <div
                  className={[
                    panelButtonCount === 3 ? "col-span-2" : "",
                    "[&>button]:h-full [&>button]:w-full",
                  ].join(" ")}
                >
                  <PanelButton label="Расписание" isActive={activePanel === "schedule"} onClick={() => togglePanel("schedule")} />
                </div>
              </div>

              <div className="relative mt-2 min-h-0 flex-1 rounded-[4px] border border-neutral-200 bg-[var(--color-brand-bg)] p-1.5 sm:mt-3 sm:p-2 lg:mt-4 lg:h-[420px] lg:flex-none">
                <div
                  className={[
                    "h-full",
                    activePanel ? "pointer-events-none invisible" : "visible",
                  ].join(" ")}
                >
                  <CoachMaps halls={halls} combineLocations={coach.id === 6} />
                </div>

                {activePanel ? (
                  <div
                    className={[
                      "absolute inset-1.5 overflow-hidden rounded-[4px] bg-white sm:inset-2",
                      activePanel === "schedule" ? "p-1.5 sm:p-2 lg:p-3" : "p-2 sm:p-3 lg:p-5",
                    ].join(" ")}
                  >
                    {renderActivePanel()}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="relative hidden min-h-[520px] bg-white lg:block" />
          </div>
        </article>

        <img
          src={modalPhoto}
          alt={coach.name}
          className={`pointer-events-none absolute bottom-0 z-20 hidden max-w-none object-contain object-bottom lg:block ${modalPhotoSizeClass}`}
        />
      </div>
    </div>
  );
}

export function Coaches() {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  return (
    <section id="coaches" className="bg-white py-14 sm:py-20">
      <div className="site-container">
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5 min-[1360px]:grid-cols-[repeat(5,240px)] min-[1360px]:justify-between">
          <div className="col-span-2 flex flex-col pb-3 lg:pb-0">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)] sm:text-lg">Команда клуба</p>
              <h2 className="mt-2 text-3xl font-bold uppercase leading-none text-black sm:mt-3 sm:text-5xl">Наши тренеры</h2>
              <p className="mt-4 max-w-[520px] text-lg font-light leading-7 text-neutral-800 sm:mt-5 sm:text-[22px] sm:leading-8">
                Тренеры клуба работают с детьми и взрослыми разного уровня подготовки. На занятиях помогают освоить базовую технику, развить физическую форму и подготовиться к аттестациям и соревнованиям.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-3 sm:mt-7 sm:gap-x-6 sm:gap-y-4 lg:grid-cols-2 min-[1360px]:grid-cols-[240px_240px] min-[1360px]:justify-between min-[1360px]:gap-x-0">
              <div className="col-span-2 flex min-h-[58px] items-center gap-3 bg-[var(--color-brand-bg)] px-4 py-3 text-sm leading-tight text-neutral-800 sm:text-base">
                <MapPin className="shrink-0 text-[var(--color-brand-blue)]" size={22} strokeWidth={2.2} />
                <span>Центральный зал ул. Тимирязевская, д. 16</span>
              </div>

              <div className="border-l-4 border-[var(--color-brand-red)] bg-[var(--color-brand-bg)] px-4 py-3">
                <div className="text-2xl font-bold leading-none text-black sm:text-3xl">11</div>
                <div className="mt-1 text-sm leading-tight text-neutral-700 sm:text-base">залов</div>
              </div>

              <div className="border-l-4 border-[var(--color-brand-blue)] bg-[var(--color-brand-bg)] px-4 py-3">
                <div className="text-2xl font-bold leading-none text-black sm:text-3xl">10+</div>
                <div className="mt-1 text-sm leading-tight text-neutral-700 sm:text-base">лет опыта</div>
              </div>
            </div>
          </div>

          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} onOpen={setSelectedCoach} />
          ))}
        </div>
      </div>

      {selectedCoach ? <CoachModal coach={selectedCoach} onClose={() => setSelectedCoach(null)} /> : null}
    </section>
  );
}
