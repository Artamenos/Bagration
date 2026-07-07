"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^8/, "7").slice(0, 11);
  if (!digits) {
    return "";
  }

  const withoutCountry = digits.startsWith("7") ? digits.slice(1) : digits;

  const part1 = withoutCountry.slice(0, 3);
  const part2 = withoutCountry.slice(3, 6);
  const part3 = withoutCountry.slice(6, 8);
  const part4 = withoutCountry.slice(8, 10);

  let result = "+7";

  if (part1) {
    result += ` (${part1}`;
  }

  if (part1.length === 3) {
    result += ")";
  }

  if (part2) {
    result += ` ${part2}`;
  }

  if (part3) {
    result += `-${part3}`;
  }

  if (part4) {
    result += `-${part4}`;
  }

  return result;
}

export function Signup() {
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [phone, setPhone] = useState("");

  return (
    <section id="signup" className="bg-white py-16">
      <div className="site-container">
        <div className="mx-auto grid max-w-[1272px] grid-cols-1 overflow-hidden rounded-[4px] bg-[var(--color-brand-bg)] lg:grid-cols-[612px_1fr]">
          <img
            src="/images/sign_up.png"
            alt="Спортсмены клуба Багратион на соревнованиях"
            className="block w-full"
          />

          <div className="px-9 py-4">
            <h2 className="text-4xl font-bold leading-none text-black">
              Онлайн-запись на пробную тренировку
            </h2>

            <p className="mt-2 text-lg leading-6 text-[var(--color-brand-blue)]">
              Заполните форму и мы подберем удобное время и зал
            </p>

            <form className="mt-4">
              <div className="border-l-2 border-[var(--color-brand-blue)] pl-7">
                <label className="block">
                  <span className="text-lg text-black">Ваше имя</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Иван Петров"
                    className="mt-1 h-9 w-full rounded-[4px] bg-white px-4 text-base text-black outline-none placeholder:text-[var(--color-brand-blue)] placeholder:opacity-55"
                  />
                </label>

                <label className="mt-3 block">
                  <span className="text-lg text-black">Номер телефона</span>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(event) => setPhone(formatPhone(event.target.value))}
                    placeholder="+7 (999) 123-45-67"
                    className="mt-1 h-9 w-full rounded-[4px] bg-white px-4 text-base text-black outline-none placeholder:text-[var(--color-brand-blue)] placeholder:opacity-55"
                  />
                </label>

                <label className="mt-3 block">
                  <span className="text-lg text-black">Выбор группы</span>
                  <select
                    name="group"
                    className="mt-1 h-9 w-full rounded-[4px] bg-white px-4 text-base text-black outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Выберите группу
                    </option>
                    <option value="kids">Детская группа</option>
                    <option value="adult">Взрослая группа</option>
                  </select>
                </label>

                <label className="mt-3 block">
                  <span className="text-lg text-black">Предпочтительный зал</span>
                  <select
                    name="gym"
                    className="mt-1 h-9 w-full rounded-[4px] bg-white px-4 text-base text-black outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Выберите зал
                    </option>
                    <option value="moscow">Москва</option>
                    <option value="region">Московская область</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 flex flex-col gap-3 pl-[30px] sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-start gap-2 text-sm leading-5 text-black">
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
                  className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-[var(--color-brand-blue)] px-7 text-lg font-bold text-white transition-colors hover:bg-[#245ba8] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[var(--color-brand-blue)]"
                >
                  <CalendarDays size={20} strokeWidth={2.3} />
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
