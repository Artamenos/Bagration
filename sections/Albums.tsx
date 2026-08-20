import { ArrowRight } from "lucide-react";

const albumColumns = [
  {
    offset: "lg:-translate-y-[104px]",
    tiles: ["h-[150px]", "h-[188px]", "h-[260px]"],
  },
  {
    offset: "lg:-translate-y-[72px]",
    tiles: ["h-[150px]", "h-[188px]", "h-[260px]"],
  },
  {
    offset: "lg:-translate-y-[40px]",
    tiles: ["h-[188px]", "h-[188px]", "h-[260px]"],
  },
];

export function Albums() {
  return (
    <section id="albums" className="overflow-hidden bg-[var(--color-brand-bg)]">
      <div className="site-container grid h-auto grid-cols-1 items-start gap-8 overflow-hidden py-12 sm:gap-12 lg:h-[504px] lg:grid-cols-[360px_1fr] lg:py-0">
        <div className="lg:py-12 lg:pr-4">
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)] sm:text-lg">
            Фотоархив клуба
          </p>

          <h2 className="mt-2 text-3xl font-bold uppercase leading-tight text-black sm:mt-3 sm:text-5xl">
            Альбомы
            <br />с мероприятий
          </h2>

          <p className="mt-4 text-base leading-6 text-neutral-800 sm:mt-5 sm:text-xl sm:leading-7">
            Соревнования, аттестации, сборы и тренировки клуба в фотографиях.
            Собираем важные моменты и победы спортсменов.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 text-base text-neutral-700">
            <span className="bg-white px-3 py-2">Соревнования</span>
            <span className="bg-white px-3 py-2">Аттестации</span>
            <span className="bg-white px-3 py-2">Сборы</span>
          </div>

          <a
            href="#events"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[6px] bg-[var(--color-brand-blue)] px-6 text-base font-bold text-white transition-colors hover:bg-[#245ba8] sm:mt-8 sm:w-fit sm:text-lg"
          >
            Смотреть больше
            <ArrowRight size={22} strokeWidth={2.4} />
          </a>
        </div>

        <div className="h-[420px] overflow-hidden lg:h-full">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:translate-y-10 lg:gap-6">
            {albumColumns.map((column, columnIndex) => (
              <div key={columnIndex} className={`grid gap-4 ${column.offset}`}>
                {column.tiles.map((heightClass, imageIndex) => (
                  <div
                    key={imageIndex}
                    className={`overflow-hidden ${heightClass}`}
                  >
                    <img
                      src="/images/album.png"
                      alt="Фото с мероприятия клуба Багратион"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
