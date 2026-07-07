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
    <article className="w-[240px] overflow-hidden rounded-[4px] border border-neutral-200 bg-[var(--color-brand-bg)] shadow-sm">
      <div
        className="relative h-[295px] overflow-hidden bg-[var(--color-brand-bg)] bg-top bg-no-repeat"
        style={{
          backgroundImage: "url('/images/logo_coaches.png')",
          backgroundSize: "240px auto",
        }}
      >
        <img
          src={coach.photo}
          alt={coach.name}
          className="absolute bottom-0 left-0 z-10 w-full"
        />
      </div>

      <div className="bg-white px-3 py-2.5 text-center">
        <h3 className="text-lg font-normal leading-tight text-black">
          {coach.name}
        </h3>

        <button
          type="button"
          className="mt-2 w-full cursor-pointer rounded-[6px] bg-[var(--color-brand-bg)] px-3 py-1.5 text-sm font-medium text-[var(--color-brand-blue)] transition-colors hover:bg-[var(--color-brand-blue)] hover:text-white"
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
        <div className="grid grid-cols-1 justify-center gap-6 lg:grid-cols-[repeat(5,240px)]">
          <div className="flex flex-col justify-between lg:col-span-2">
            <div>
              <p className="text-lg font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)]">
                Команда клуба
              </p>

              <h2 className="mt-3 text-5xl font-bold uppercase leading-none text-black">
                Наши тренеры
              </h2>

              <p className="mt-5 max-w-[430px] text-xl leading-7 text-neutral-800">
                Тренеры клуба «Багратион» — действующие спортсмены и
                наставники, которые помогают развивать технику, дисциплину и
                уверенность.
              </p>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="border-l-4 border-[var(--color-brand-red)] bg-[var(--color-brand-bg)] px-4 py-3">
                <div className="text-3xl font-bold leading-none text-black">
                  8
                </div>
                <div className="mt-1 text-base leading-tight text-neutral-700">
                  тренеров
                </div>
              </div>

              <div className="border-l-4 border-[var(--color-brand-blue)] bg-[var(--color-brand-bg)] px-4 py-3">
                <div className="text-3xl font-bold leading-none text-black">
                  10+
                </div>
                <div className="mt-1 text-base leading-tight text-neutral-700">
                  лет опыта
                </div>
              </div>
            </div>
          </div>

          {topCoaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(5,240px)]">
          {bottomCoaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      </div>
    </section>
  );
}
