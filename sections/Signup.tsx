"use client";

import { useState } from "react";

export function Signup() {
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

  return (
    <section id="signup" className="bg-white py-16">
      <div className="site-container">
        <div className="mx-auto grid max-w-[1272px] grid-cols-1 overflow-hidden rounded-[4px] bg-[var(--color-brand-bg)] lg:grid-cols-[612px_1fr]">
          <img
            src="/images/sign_up.png"
            alt="Спортсмены клуба Багратион на соревнованиях"
            className="block w-full"
          />

          <div className="px-9 py-5">
            <h2 className="text-[34px] font-bold leading-none text-black">
              Онлайн-запись на пробную тренировку
            </h2>

            <p className="mt-3 text-[18px] leading-6 text-[var(--color-brand-blue)]">
              Заполните форму и мы подберем удобное время и зал
            </p>

            <form className="mt-5 border-l-2 border-[var(--color-brand-blue)] pl-7">
              <label className="block">
                <span className="text-[17px] text-black">Ваше имя</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Иван Петров"
                  className="mt-1 h-10 w-full rounded-[4px] bg-white px-4 text-[16px] text-black outline-none placeholder:text-[var(--color-brand-blue)] placeholder:opacity-55"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-[17px] text-black">Номер телефона</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+7 (999) 123-45-67"
                  className="mt-1 h-10 w-full rounded-[4px] bg-white px-4 text-[16px] text-black outline-none placeholder:text-[var(--color-brand-blue)] placeholder:opacity-55"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-[17px] text-black">Выбор группы</span>
                <select
                  name="group"
                  className="mt-1 h-10 w-full rounded-[4px] bg-white px-4 text-[16px] text-black outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Выберите группу
                  </option>
                  <option value="kids">Детская группа</option>
                  <option value="adult">Взрослая группа</option>
                </select>
              </label>

              <label className="mt-4 block">
                <span className="text-[17px] text-black">
                  Предпочтительный зал
                </span>
                <select
                  name="gym"
                  className="mt-1 h-10 w-full rounded-[4px] bg-white px-4 text-[16px] text-black outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Выберите зал
                  </option>
                  <option value="moscow">Москва</option>
                  <option value="region">Московская область</option>
                </select>
              </label>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-start gap-2 text-[14px] leading-5 text-black">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={isAgreementChecked}
                    onChange={(event) =>
                      setIsAgreementChecked(event.target.checked)
                    }
                  />
                  <span>
                    Я согласен(-на) на обработку персональных данных
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!isAgreementChecked}
                  className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-[4px] bg-[var(--color-brand-blue)] px-7 text-[17px] font-bold text-white transition-colors hover:bg-[#245ba8] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[var(--color-brand-blue)]"
                >
                  Записаться
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
