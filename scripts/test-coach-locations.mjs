import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Evaluate only the local, declarative data block, without React or browser APIs.
const source = readFileSync(new URL("../sections/Coaches.tsx", import.meta.url), "utf8");
const start = source.indexOf("const timiryazevskayaBounds:");
const end = source.indexOf("function CoachCard(");
assert.ok(start >= 0 && end > start, "Coach data block must exist");
const code = ts.transpile(source.slice(start, end) + "\nglobalThis.coaches = coaches;", {
  target: ts.ScriptTarget.ES2022,
});
const context = vm.createContext({});
vm.runInContext(code, context, { timeout: 1000 });
const coaches = JSON.parse(JSON.stringify(context.coaches));
const armenak = coaches.find(({ id }) => id === 1);
const mikhail = coaches.find(({ id }) => id === 2);
const elizaveta = coaches.find(({ id }) => id === 7);
assert.equal(armenak.rank, "IV дан");
assert.equal(mikhail.hall.point.lat, 56.013814);
assert.equal(mikhail.additionalHalls?.length ?? 0, 0);
assert.equal(mikhail.schedules.length, 2);
assert.equal(mikhail.schedules[0].title, "Москва, Астрадамский пр., д. 5");
assert.deepEqual(mikhail.schedules[0].rows, [
  { day: "Понедельник", time: "17:00–17:45", group: "Дети 4–7 лет" },
  { day: "", time: "17:45–19:15", group: "Дети 7–17 лет" },
  { day: "Среда", time: "17:00–17:45", group: "Дети 4–7 лет" },
  { day: "", time: "17:45–19:15", group: "Дети 7–17 лет" },
  { day: "Пятница", time: "17:00–17:45", group: "Дети 4–7 лет" },
  { day: "", time: "17:45–19:15", group: "Дети 7–17 лет" },
]);
assert.equal(mikhail.schedules[1].title, "Лобня, ул. Чехова");
assert.deepEqual(elizaveta.hall, armenak.hall);
assert.equal(elizaveta.cardAddress, armenak.cardAddress);
assert.deepEqual(elizaveta.schedules[0].rows, [
  { day: "Вторник", time: "17:30–18:30" },
  { day: "Четверг", time: "17:30–18:30" },
]);
assert.doesNotMatch(JSON.stringify(coaches), /Тимирязевск[^"\n]{0,40}16|Тимирязево|55\.8141|37\.5666/i);
for (const file of ["../app/layout.tsx", "../components/Footer.tsx"]) {
  const text = readFileSync(new URL(file, import.meta.url), "utf8");
  assert.doesNotMatch(text, /Тимирязевск[^"\n]{0,40}16/i);
  assert.ok(text.includes("Астрадамский пр., д. 5"));
}
console.log("PASS: ranks, active halls, maps, schedules, footer and SEO address.");
