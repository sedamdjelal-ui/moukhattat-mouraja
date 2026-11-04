"use client";

import { useState } from "react";
import { useStoredState, newId } from "../lib/useStoredState";
import { DAYS, buildPlan, weeklyTotals, formatMinutes } from "./plan";

const DEFAULT = {
  subjects: [],
  // ساعات المراجعة المتاحة في كل يوم (أيام الدراسة أقل من العطلة)
  hours: { sat: 3, sun: 2, mon: 2, tue: 2, wed: 2, thu: 2, fri: 3 },
};

const MAX_COEF = 7;
const MAX_HOURS = 10;

// زر - قيمة + بخطوط كبيرة مريحة للهاتف
function Stepper({ value, onChange, min, max, step = 1, label, display }) {
  const btn =
    "size-9 rounded-md border-2 border-grid bg-white text-lg font-bold text-ink disabled:opacity-30";
  return (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        aria-label={`زيادة ${label}`}
      >
        +
      </button>
      <span className="min-w-16 text-center font-medium" aria-live="polite">
        {display ?? value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        aria-label={`نقص ${label}`}
      >
        −
      </button>
    </div>
  );
}

export default function ScheduleBoard() {
  const [data, setData, loaded] = useStoredState("mm:v1:schedule", DEFAULT);
  const [lessonSubjects] = useStoredState("mm:v1:subjects", []);
  const [name, setName] = useState("");

  const subjects = data.subjects;
  const names = new Set(subjects.map((s) => s.name));
  const importable = lessonSubjects.filter((s) => !names.has(s.name));

  const plan = buildPlan(subjects, data.hours);
  const totals = weeklyTotals(plan);
  const weekMinutes = Object.values(totals).reduce((a, b) => a + b, 0);
  const nameOf = Object.fromEntries(subjects.map((s) => [s.id, s.name]));

  function save(change) {
    setData({ ...data, ...change });
  }

  function addSubjects(list) {
    const fresh = list
      .map((n) => n.trim())
      .filter((n, i, arr) => n && !names.has(n) && arr.indexOf(n) === i)
      .map((n) => ({ id: newId(), name: n, coef: 1 }));
    if (fresh.length) save({ subjects: [...subjects, ...fresh] });
  }

  function setCoef(id, coef) {
    save({
      subjects: subjects.map((s) => (s.id === id ? { ...s, coef } : s)),
    });
  }

  function removeSubject(id) {
    save({ subjects: subjects.filter((s) => s.id !== id) });
  }

  function setHours(key, h) {
    save({ hours: { ...data.hours, [key]: h } });
  }

  if (!loaded) return <p className="mt-8 text-muted">جاري التحميل…</p>;

  return (
    <div className="mt-8 space-y-12">
      {/* الخطوة 1: المواد والمعاملات */}
      <section aria-labelledby="step-subjects" className="print:hidden">
        <h2 id="step-subjects" className="font-display text-xl font-bold">
          موادك ومعاملاتها
        </h2>
        <p className="mt-1 text-muted">
          المادة ذات المعامل الأكبر تاخذ وقت أكثر في الجدول.
        </p>

        {subjects.length > 0 && (
          <ul className="mt-4 divide-y divide-grid rounded-lg border-2 border-grid bg-white">
            {subjects.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-bold">{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted">المعامل</span>
                  <Stepper
                    value={s.coef}
                    min={1}
                    max={MAX_COEF}
                    label={`معامل ${s.name}`}
                    onChange={(v) => setCoef(s.id, v)}
                  />
                  <button
                    type="button"
                    onClick={() => removeSubject(s.id)}
                    aria-label={`حذف ${s.name} من الجدول`}
                    className="px-2 text-xl leading-none text-muted hover:text-margin"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {importable.length > 0 && (
          <button
            type="button"
            onClick={() => addSubjects(importable.map((s) => s.name))}
            className="mt-4 rounded-md bg-highlight px-4 py-2 font-medium"
          >
            أضف موادك من قائمة الدروس ({importable.length})
          </button>
        )}

        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addSubjects([name]);
            setName("");
          }}
        >
          <label htmlFor="schedule-subject" className="sr-only">
            اسم المادة
          </label>
          <input
            id="schedule-subject"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم المادة"
            maxLength={40}
            className="min-w-0 flex-1 rounded-md border-2 border-grid bg-white px-3 py-2 focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="rounded-md bg-ink px-4 py-2 font-medium text-white disabled:opacity-40"
          >
            أضف
          </button>
        </form>
      </section>

      {/* الخطوة 2: الوقت المتاح */}
      <section aria-labelledby="step-hours" className="print:hidden">
        <h2 id="step-hours" className="font-display text-xl font-bold">
          وقتك في الأسبوع
        </h2>
        <p className="mt-1 text-muted">
          قدّاش من ساعة تقدر تراجع كل يوم؟ خلّي 0 لليوم اللي تحب ترتاح فيه.
        </p>
        <ul className="mt-4 divide-y divide-grid rounded-lg border-2 border-grid bg-white">
          {DAYS.map((d) => (
            <li
              key={d.key}
              className="flex items-center justify-between gap-3 p-3"
            >
              <span className="font-bold">{d.name}</span>
              <Stepper
                value={data.hours[d.key] ?? 0}
                min={0}
                max={MAX_HOURS}
                step={0.5}
                label={`ساعات ${d.name}`}
                display={
                  data.hours[d.key]
                    ? formatMinutes(data.hours[d.key] * 60)
                    : "راحة"
                }
                onChange={(v) => setHours(d.key, v)}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* النتيجة: الجدول */}
      <section aria-labelledby="the-plan">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2
            id="the-plan"
            className="font-display text-2xl font-bold text-ink"
          >
            جدولك هذا الأسبوع
          </h2>
          {weekMinutes > 0 && (
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-md border-2 border-ink px-3 py-1.5 text-sm font-medium text-ink print:hidden"
            >
              اطبع الجدول
            </button>
          )}
        </div>

        {subjects.length === 0 ? (
          <p className="mt-4 text-lg">
            أضف مادة وحدة على الأقل، ويظهرلك الجدول هنا.
          </p>
        ) : weekMinutes === 0 ? (
          <p className="mt-4 text-lg">
            حدّد ساعات المراجعة في يوم واحد على الأقل.
          </p>
        ) : (
          <>
            <p className="mt-2 text-muted">
              المجموع: {formatMinutes(weekMinutes)} في الأسبوع. كل حصة ساعة، وخذ
              راحة قصيرة بين الحصص.
            </p>

            <ol className="notebook mt-4 rounded-lg border-2 border-grid">
              {DAYS.map((d) => (
                <li
                  key={d.key}
                  className="margin-line flex flex-col gap-2 border-b-2 border-grid p-3 ps-5 last:border-b-0 sm:flex-row sm:items-start"
                >
                  <span className="w-24 shrink-0 text-lg font-bold text-ink">
                    {d.name}
                  </span>
                  {plan[d.key].length === 0 ? (
                    <span className="text-muted">راحة</span>
                  ) : (
                    <ul className="flex flex-wrap gap-2">
                      {plan[d.key].map((b, i) => (
                        <li
                          key={i}
                          className="rounded-md border-2 border-grid bg-white px-3 py-1"
                        >
                          <span className="font-medium">
                            {nameOf[b.subjectId]}
                          </span>{" "}
                          <span className="text-sm text-muted">
                            {formatMinutes(b.minutes)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>

            <h3 className="mt-8 font-bold">الوقت لكل مادة في الأسبوع</h3>
            <ul className="mt-2 space-y-1">
              {subjects.map((s) => (
                <li key={s.id} className="flex items-baseline">
                  <span>{s.name}</span>
                  <span className="leader" aria-hidden="true" />
                  <span className="font-medium">
                    {formatMinutes(totals[s.id] || 0)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
