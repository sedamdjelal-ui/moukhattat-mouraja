"use client";

import { useState } from "react";
import { useStoredState, newId } from "../lib/useStoredState";

// مواد شائعة في الثانوي الجزائري لإضافتها بضغطة
const SUGGESTED = [
  "الرياضيات",
  "الفيزياء",
  "العلوم الطبيعية",
  "اللغة العربية",
  "الفرنسية",
  "الإنجليزية",
  "الفلسفة",
  "التاريخ والجغرافيا",
  "العلوم الإسلامية",
];

function countLessons(subjects) {
  let total = 0;
  let done = 0;
  for (const s of subjects) {
    total += s.lessons.length;
    done += s.lessons.filter((l) => l.done).length;
  }
  return { total, done };
}

function percent(done, total) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

// شريط التقدم: يمتلئ بلون قلم التحديد
function ProgressBar({ done, total, label }) {
  const p = percent(done, total);
  return (
    <div
      role="progressbar"
      aria-valuenow={p}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-3 w-full overflow-hidden rounded-full border border-grid bg-white"
    >
      <div
        className="h-full bg-highlight transition-[width] duration-300"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}

export default function LessonsBoard() {
  const [subjects, setSubjects, loaded] = useStoredState("mm:v1:subjects", []);
  const [subjectName, setSubjectName] = useState("");

  const { total, done } = countLessons(subjects);
  const names = new Set(subjects.map((s) => s.name));
  const suggestions = SUGGESTED.filter((n) => !names.has(n));

  function addSubject(name) {
    const clean = name.trim();
    if (!clean || names.has(clean)) return;
    setSubjects([...subjects, { id: newId(), name: clean, lessons: [] }]);
  }

  function removeSubject(id, name) {
    if (!window.confirm(`حذف مادة "${name}" وكل دروسها؟`)) return;
    setSubjects(subjects.filter((s) => s.id !== id));
  }

  function updateSubject(id, change) {
    setSubjects(subjects.map((s) => (s.id === id ? change(s) : s)));
  }

  function addLesson(subjectId, title) {
    updateSubject(subjectId, (s) => ({
      ...s,
      lessons: [...s.lessons, { id: newId(), title, done: false }],
    }));
  }

  function toggleLesson(subjectId, lessonId) {
    updateSubject(subjectId, (s) => ({
      ...s,
      lessons: s.lessons.map((l) =>
        l.id === lessonId ? { ...l, done: !l.done } : l,
      ),
    }));
  }

  function removeLesson(subjectId, lessonId) {
    updateSubject(subjectId, (s) => ({
      ...s,
      lessons: s.lessons.filter((l) => l.id !== lessonId),
    }));
  }

  if (!loaded) {
    return <p className="mt-8 text-muted">جاري التحميل…</p>;
  }

  return (
    <div className="mt-8 space-y-10">
      {/* التقدم العام */}
      {total > 0 && (
        <section aria-label="التقدم العام">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-medium">
              كمّلت {done} من {total} درس
            </span>
            <span className="font-display text-2xl font-bold text-ink">
              {percent(done, total)}٪
            </span>
          </div>
          <ProgressBar done={done} total={total} label="التقدم العام" />
        </section>
      )}

      {/* المواد */}
      {subjects.length === 0 ? (
        <p className="text-lg">
          ابدأ بإضافة مادة، ومن بعد سجّل دروسها واحد بواحد.
        </p>
      ) : (
        <div className="space-y-6">
          {subjects.map((s) => (
            <SubjectCard
              key={s.id}
              subject={s}
              onAddLesson={(title) => addLesson(s.id, title)}
              onToggle={(lessonId) => toggleLesson(s.id, lessonId)}
              onRemoveLesson={(lessonId) => removeLesson(s.id, lessonId)}
              onRemove={() => removeSubject(s.id, s.name)}
            />
          ))}
        </div>
      )}

      {/* إضافة مادة */}
      <section aria-labelledby="add-subject">
        <h2 id="add-subject" className="font-display text-xl font-bold">
          أضف مادة
        </h2>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addSubject(subjectName);
            setSubjectName("");
          }}
        >
          <label htmlFor="subject-name" className="sr-only">
            اسم المادة
          </label>
          <input
            id="subject-name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="اسم المادة"
            maxLength={40}
            className="min-w-0 flex-1 rounded-md border-2 border-grid bg-white px-3 py-2 focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-ink px-4 py-2 font-medium text-white disabled:opacity-40"
            disabled={!subjectName.trim()}
          >
            أضف
          </button>
        </form>

        {suggestions.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-muted">أو اختر من المواد الشائعة:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => addSubject(n)}
                  className="rounded-full border-2 border-grid bg-white px-3 py-1 text-sm hover:border-ink hover:text-ink"
                >
                  + {n}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function SubjectCard({
  subject,
  onAddLesson,
  onToggle,
  onRemoveLesson,
  onRemove,
}) {
  const [title, setTitle] = useState("");
  const done = subject.lessons.filter((l) => l.done).length;
  const total = subject.lessons.length;
  const inputId = `lesson-${subject.id}`;

  return (
    <section className="rounded-lg border-2 border-grid bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">{subject.name}</h3>
          <p className="text-sm text-muted">
            {total === 0 ? "ما زال ما سجّلتش دروس" : `${done} من ${total} درس`}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-muted hover:text-margin"
        >
          حذف المادة
        </button>
      </div>

      {total > 0 && (
        <div className="mt-3">
          <ProgressBar
            done={done}
            total={total}
            label={`تقدم ${subject.name}`}
          />
        </div>
      )}

      {total > 0 && (
        <ul className="mt-4 divide-y divide-grid">
          {subject.lessons.map((l) => (
            <li key={l.id} className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id={l.id}
                checked={l.done}
                onChange={() => onToggle(l.id)}
                className="size-5 shrink-0 accent-[var(--ink)]"
              />
              <label htmlFor={l.id} className="flex-1 cursor-pointer">
                {/* الدرس المكتمل يتلوّن بقلم التحديد مثل الكراس */}
                <span className={l.done ? "marker" : ""}>{l.title}</span>
              </label>
              <button
                type="button"
                onClick={() => onRemoveLesson(l.id)}
                aria-label={`حذف درس ${l.title}`}
                className="px-2 text-xl leading-none text-muted hover:text-margin"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const clean = title.trim();
          if (!clean) return;
          onAddLesson(clean);
          setTitle("");
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          عنوان الدرس في {subject.name}
        </label>
        <input
          id={inputId}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان الدرس"
          maxLength={80}
          className="min-w-0 flex-1 rounded-md border-2 border-grid bg-paper px-3 py-2 focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-md border-2 border-ink px-3 py-2 font-medium text-ink disabled:opacity-40"
        >
          أضف درس
        </button>
      </form>
    </section>
  );
}
