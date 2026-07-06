const coaches = [
  { id: 1, name: "Бахчиев Арменак", photo: "/images/Armenak_vin.png" },
  { id: 2, name: "Иванова Елизавета", photo: "/images/Elisaveta_vin.png" },
  { id: 3, name: "Медведев Михаил", photo: "/images/Mihail_vin.png" },
  { id: 4, name: "Улещенко Андрей", photo: "/images/Andrei_vin.png" },
  { id: 5, name: "Абержав Адель", photo: "/images/Adel_vin.png" },
  { id: 6, name: "Лушкина Вера", photo: "/images/Vera_vin.png" },
  { id: 7, name: "Хасянов Рустам", photo: "/images/Rustam_vin.png" },
  { id: 8, name: "Кураш Анастасия", photo: "/images/Anastasia_vin.png" },
];

type Coach = {
  id: number;
  name: string;
  photo: string;
};

function CoachCard({ coach }: { coach: Coach }) {
  return (
    <article className="w-[265px] overflow-hidden rounded-[4px] border border-neutral-200 bg-[var(--color-brand-bg)] shadow-sm">
      <div
        className="relative h-[328px] overflow-hidden bg-[var(--color-brand-bg)] bg-top bg-no-repeat"
        style={{
          backgroundImage: "url('/images/logo_coaches.png')",
          backgroundSize: "265px auto",
        }}
      >
        <img
          src={coach.photo}
          alt={coach.name}
          className="absolute bottom-0 left-0 z-10 w-full"
        />
      </div>

      <div className="bg-white px-3 py-3 text-center">
        <h3 className="text-[20px] font-normal leading-tight text-black">
          {coach.name}
        </h3>

        <button
          type="button"
          className="mt-2 w-full cursor-pointer rounded-[6px] bg-[var(--color-brand-bg)] px-3 py-1.5 text-[15px] font-medium text-[var(--color-brand-blue)] transition-colors hover:bg-[var(--color-brand-blue)] hover:text-white"
        >
          Открыть информацию
        </button>
      </div>
    </article>
  );
}

export function Coaches() {
  const topCoaches = coaches.slice(0, 3);
  const bottomCoaches = coaches.slice(3);

  return (
    <section id="coaches" className="bg-white py-16">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-6 lg:flex lg:items-start lg:justify-between">
          <div className="max-w-[430px]">
            <p className="text-[18px] font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)]">
              Команда клуба
            </p>

            <h2 className="mt-3 text-[44px] font-bold uppercase leading-none text-black">
              Наши тренеры
            </h2>

            <p className="mt-5 text-[20px] leading-7 text-neutral-800">
              Тренеры клуба «Багратион» — действующие спортсмены и наставники,
              которые помогают развивать технику, дисциплину и уверенность.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="border-l-4 border-[var(--color-brand-red)] bg-[var(--color-brand-bg)] px-4 py-3">
                <div className="text-[30px] font-bold leading-none text-black">
                  8
                </div>
                <div className="mt-1 text-[15px] leading-tight text-neutral-700">
                  тренеров
                </div>
              </div>

              <div className="border-l-4 border-[var(--color-brand-blue)] bg-[var(--color-brand-bg)] px-4 py-3">
                <div className="text-[30px] font-bold leading-none text-black">
                  10+
                </div>
                <div className="mt-1 text-[15px] leading-tight text-neutral-700">
                  лет опыта
                </div>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-[18px] leading-6 text-neutral-800">
              <li>Детские и взрослые группы</li>
              <li>Подготовка к аттестациям</li>
              <li>Соревнования и учебные сборы</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:flex lg:justify-end">
            {topCoaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(5,265px)] lg:justify-between">
          {bottomCoaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      </div>
    </section>
  );
}
