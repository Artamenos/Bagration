"use client";

import { CalendarDays, CircleAlert, CircleCheck } from "lucide-react";
import { type FormEvent, useState } from "react";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

type ContactResponse = {
  ok?: boolean;
  message?: string;
};

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
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAgreementChecked || submitStatus === "submitting") {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitStatus("submitting");
    setSubmitMessage("");

    try {
      const response = await fetch("/api/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          phone,
          group: String(formData.get("group") ?? ""),
          gym: String(formData.get("gym") ?? ""),
          consent: isAgreementChecked,
          website: String(formData.get("website") ?? ""),
          elapsedMs: Date.now() - formStartedAt,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as ContactResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Не удалось отправить заявку. Попробуйте позже.");
      }

      form.reset();
      setPhone("");
      setIsAgreementChecked(false);
      setFormStartedAt(Date.now());
      setSubmitStatus("success");
      setSubmitMessage(result.message || "Спасибо! Заявка отправлена.");
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(error instanceof Error ? error.message : "Не удалось отправить заявку. Попробуйте позже.");
    }
  }

  return (
    <section id="signup" className="bg-white py-28">
      <div className="site-container">
        <div className="mx-auto grid max-w-[1272px] grid-cols-1 overflow-hidden rounded-[4px] border border-neutral-200 bg-[var(--color-brand-bg)] shadow-sm lg:grid-cols-[612px_1fr]">
          <img
            src="/images/sign_up.png"
            alt="Спортсмены клуба Багратион на соревнованиях"
            className="h-full w-full object-cover"
          />

          <div className="px-9 py-5">
            <h2 className="text-4xl font-bold leading-none text-black">
              Онлайн-запись на пробную тренировку
            </h2>

            <p className="mt-2 text-lg leading-6 text-[var(--color-brand-blue)]">
              Заполните форму и мы подберем удобное время и зал
            </p>

            <form method="post" onSubmit={handleSubmit} className="relative mt-4">
              <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label>
                  Не заполняйте это поле
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="border-l-2 border-[var(--color-brand-blue)] pl-7">
                <label className="block">
                  <span className="text-lg text-black">Ваше имя</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Иван Петров"
                    autoComplete="name"
                    minLength={2}
                    maxLength={80}
                    required
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
                    autoComplete="tel"
                    inputMode="tel"
                    minLength={18}
                    required
                    className="mt-1 h-9 w-full rounded-[4px] bg-white px-4 text-base text-black outline-none placeholder:text-[var(--color-brand-blue)] placeholder:opacity-55"
                  />
                </label>

                <label className="mt-3 block">
                  <span className="text-lg text-black">Выбор группы</span>
                  <select
                    name="group"
                    className="mt-1 h-9 w-full rounded-[4px] bg-white px-4 text-base text-black outline-none"
                    defaultValue=""
                    required
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
                    required
                  >
                    <option value="" disabled>
                      Выберите зал
                    </option>
                    <option value="astradamsky">Москва, Астрадамский проезд, 5</option>
                    <option value="timiryazevo">Москва, Тимирязевская улица, 16</option>
                    <option value="lobnya">Лобня, улица Чехова, 3А</option>
                    <option value="vernadskogo">Москва, проспект Вернадского, 94к7</option>
                    <option value="raspletina">Москва, улица Расплетина, 1</option>
                    <option value="zhasminovaya">Апрелевка, Жасминовая улица, 10</option>
                    <option value="aprelevka">Апрелевка, Августовская улица, 14</option>
                    <option value="izvarino">Изварино</option>
                    <option value="yablochkova">Москва, улица Яблочкова, 7</option>
                    <option value="unsure">Нужна помощь с выбором зала</option>
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
                    Я даю согласие на обработку указанных персональных данных для связи по вопросу пробной тренировки
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!isAgreementChecked || submitStatus === "submitting"}
                  className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-[var(--color-brand-blue)] px-7 text-lg font-bold text-white transition-colors hover:bg-[#245ba8] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[var(--color-brand-blue)]"
                >
                  <CalendarDays size={20} strokeWidth={2.3} />
                  {submitStatus === "submitting" ? "Отправляем…" : "Записаться"}
                </button>
              </div>

              {submitMessage ? (
                <div
                  className={`ml-[30px] mt-4 flex items-start gap-3 rounded-[6px] border px-4 py-3 shadow-sm ${
                    submitStatus === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                      : "border-red-200 bg-red-50 text-red-950"
                  }`}
                  role={submitStatus === "error" ? "alert" : "status"}
                  aria-live="polite"
                >
                  {submitStatus === "success" ? (
                    <CircleCheck className="mt-0.5 shrink-0 text-emerald-600" size={22} strokeWidth={2.2} />
                  ) : (
                    <CircleAlert className="mt-0.5 shrink-0 text-red-600" size={22} strokeWidth={2.2} />
                  )}
                  <div>
                    <p className="text-sm font-bold">
                      {submitStatus === "success" ? "Заявка отправлена" : "Не удалось отправить заявку"}
                    </p>
                    <p className="mt-0.5 text-sm leading-5 opacity-80">{submitMessage}</p>
                  </div>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
