import { ArrowRight } from "lucide-react";

const albumColumns = [
  {
    offset: "-translate-y-[104px]",
    tiles: ["h-[150px]", "h-[188px]", "h-[260px]"],
  },
  {
    offset: "-translate-y-[72px]",
    tiles: ["h-[150px]", "h-[188px]", "h-[260px]"],
  },
  {
    offset: "-translate-y-[40px]",
    tiles: ["h-[188px]", "h-[188px]", "h-[260px]"],
  },
];

export function Albums() {
  return (
    <section id="albums" className="overflow-hidden bg-[var(--color-brand-bg)]">
      <div className="site-container grid h-[504px] grid-cols-1 items-start gap-12 overflow-hidden lg:grid-cols-[360px_1fr]">
        <div className="py-12 pr-4">
          <p className="text-[18px] font-medium uppercase tracking-[0.12em] text-[var(--color-brand-blue)]">
            Фотоархив клуба
          </p>

          <h2 className="mt-3 text-[44px] font-bold uppercase leading-[1.08] text-black">
            Альбомы
            <br />с мероприятий
          </h2>

          <p className="mt-5 text-[20px] leading-7 text-neutral-800">
            Соревнования, аттестации, сборы и тренировки клуба в фотографиях.
            Собираем важные моменты и победы спортсменов.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 text-[16px] text-neutral-700">
            <span className="bg-white px-3 py-2">Соревнования</span>
            <span className="bg-white px-3 py-2">Аттестации</span>
            <span className="bg-white px-3 py-2">Сборы</span>
          </div>

          <a
            href="#events"
            className="mt-8 inline-flex h-[48px] items-center gap-3 rounded-[6px] bg-[var(--color-brand-blue)] px-6 text-[18px] font-bold text-white transition-colors hover:bg-[#245ba8]"
          >
            Смотреть больше
            <ArrowRight size={22} strokeWidth={2.4} />
          </a>
        </div>

        <div className="h-full overflow-hidden">
          <div className="grid translate-y-10 grid-cols-1 gap-6 md:grid-cols-3">
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
