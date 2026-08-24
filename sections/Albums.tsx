import { ArrowRight } from "lucide-react";

const albumColumns = [
  {
    offset: "lg:-translate-y-[104px]",
    images: ["117.jpg", "112.jpg", "111.jpg"],
  },
  {
    offset: "lg:-translate-y-[72px]",
    images: ["113.jpg", "114.jpg", "1_2.png"],
  },
  {
    offset: "lg:-translate-y-[40px]",
    images: ["115.jpg", "116.jpg", "1_3.png"],
  },
];

const mobileAlbumImages = [
  "117.jpg",
  "113.jpg",
  "115.jpg",
  "112.jpg",
  "114.jpg",
  "116.jpg",
];

export function Albums() {
  return (
    <section id="albums" className="relative overflow-hidden bg-white py-14 sm:py-20">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-14 top-14 bg-[var(--color-brand-bg)] sm:bottom-20 sm:top-20" />

      <div className="site-container relative grid h-auto grid-cols-1 items-start gap-8 overflow-hidden sm:gap-12 lg:h-[504px] lg:grid-cols-[360px_1fr]">
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
            href="https://t.me/s/kyokushin_bagration"
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[6px] bg-[var(--color-brand-blue)] px-6 text-base font-bold text-white transition-colors hover:bg-[#245ba8] sm:mt-8 sm:w-fit sm:text-lg"
          >
            Смотреть больше
            <ArrowRight size={22} strokeWidth={2.4} />
          </a>
        </div>

        <div className="h-[410px] overflow-hidden md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {mobileAlbumImages.map((imageName, index) => (
              <div key={imageName} className="h-[130px] overflow-hidden rounded-[2px]">
                <img
                  src={`/images/${imageName}`}
                  alt={`Фото с мероприятия клуба Багратион ${index + 1}`}
                  className="block h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden h-[420px] overflow-hidden md:block lg:h-full">
          <div className="grid justify-end gap-4 md:grid-cols-[repeat(3,minmax(0,290px))] lg:translate-y-10">
            {albumColumns.map((column, columnIndex) => (
              <div key={columnIndex} className={`grid content-start gap-3 ${column.offset}`}>
                {column.images.map((imageName, imageIndex) => (
                  <div
                    key={imageName}
                    className="h-[160px] overflow-hidden sm:h-[190px]"
                  >
                    <img
                      src={`/images/${imageName}`}
                      alt={`Фото с мероприятия клуба Багратион, ряд ${imageIndex + 1}, колонка ${columnIndex + 1}`}
                      className="block h-full w-full object-cover"
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
