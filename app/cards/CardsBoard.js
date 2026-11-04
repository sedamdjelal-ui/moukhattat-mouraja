"use client";

import { useState } from "react";
import { useStoredState, newId } from "../lib/useStoredState";

// كل بطاقة في وحدة من 3 علب (طريقة لايتنر):
// 1 = صعبة، 2 = متوسطة، 3 = محفوظة. البطاقات الصعبة تجي أولاً في المراجعة.
const BOXES = [
  { box: 1, label: "صعبة" },
  { box: 2, label: "متوسطة" },
  { box: 3, label: "محفوظة" },
];

const ALL = "__all__";

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ترتيب المراجعة: الصعبة أولاً، وداخل كل علبة ترتيب عشوائي
function buildQueue(cards) {
  return [1, 2, 3].flatMap((box) =>
    shuffle(cards.filter((c) => c.box === box)).map((c) => c.id),
  );
}

export default function CardsBoard() {
  const [cards, setCards, loaded] = useStoredState("mm:v1:cards", []);
  const [lessonSubjects] = useStoredState("mm:v1:subjects", []);
  const [filter, setFilter] = useState(ALL);
  const [session, setSession] = useState(null);

  const subjects = [
    ...new Set([
      ...cards.map((c) => c.subject),
      ...lessonSubjects.map((s) => s.name),
    ]),
  ].filter(Boolean);
  const cardSubjects = [...new Set(cards.map((c) => c.subject))];
  const visible =
    filter === ALL ? cards : cards.filter((c) => c.subject === filter);

  function addCard(card) {
    setCards([...cards, { id: newId(), box: 1, ...card }]);
  }

  function removeCard(id) {
    setCards(cards.filter((c) => c.id !== id));
  }

  function answer(id, knew) {
    setCards(
      cards.map((c) =>
        c.id === id ? { ...c, box: knew ? Math.min(3, c.box + 1) : 1 } : c,
      ),
    );
  }

  function startSession(list) {
    if (list.length === 0) return;
    setSession({ queue: buildQueue(list), index: 0, knew: 0 });
  }

  if (!loaded) return <p className="mt-8 text-muted">جاري التحميل…</p>;

  if (session) {
    return (
      <ReviewSession
        session={session}
        cards={cards}
        onAnswer={(id, knew) => {
          answer(id, knew);
          setSession({
            ...session,
            index: session.index + 1,
            knew: session.knew + (knew ? 1 : 0),
          });
        }}
        onRetryHard={() => {
          const ids = new Set(session.queue);
          startSession(cards.filter((c) => ids.has(c.id) && c.box === 1));
        }}
        onClose={() => setSession(null)}
      />
    );
  }

  return (
    <div className="mt-8 space-y-12">
      {cards.length > 0 && (
        <section aria-labelledby="review">
          <h2 id="review" className="font-display text-xl font-bold">
            المراجعة
          </h2>

          {cardSubjects.length > 1 && (
            <div
              className="mt-3 flex flex-wrap gap-2"
              role="group"
              aria-label="اختر المادة"
            >
              {[ALL, ...cardSubjects].map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={filter === s}
                  onClick={() => setFilter(s)}
                  className={`rounded-full border-2 px-3 py-1 text-sm ${
                    filter === s
                      ? "border-ink bg-ink text-white"
                      : "border-grid bg-white hover:border-ink"
                  }`}
                >
                  {s === ALL ? "كل المواد" : s}
                </button>
              ))}
            </div>
          )}

          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
            {BOXES.map((b) => (
              <div
                key={b.box}
                className="rounded-md border-2 border-grid bg-white p-2"
              >
                <dt className="text-sm text-muted">{b.label}</dt>
                <dd className="font-display text-2xl font-bold text-ink">
                  {visible.filter((c) => c.box === b.box).length}
                </dd>
              </div>
            ))}
          </dl>

          <button
            type="button"
            onClick={() => startSession(visible)}
            className="mt-4 w-full rounded-md bg-ink px-6 py-3 font-medium text-white shadow-[4px_4px_0_var(--highlight)] sm:w-auto"
          >
            ابدأ المراجعة ({visible.length} بطاقة)
          </button>
        </section>
      )}

      <AddCardForm
        subjects={subjects}
        defaultSubject={filter === ALL ? "" : filter}
        onAdd={addCard}
        first={cards.length === 0}
      />

      {visible.length > 0 && (
        <section aria-labelledby="all-cards">
          <h2 id="all-cards" className="font-display text-xl font-bold">
            البطاقات ({visible.length})
          </h2>
          <ul className="mt-3 divide-y divide-grid rounded-lg border-2 border-grid bg-white">
            {visible.map((c) => (
              <li key={c.id} className="flex items-start gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium break-words">{c.q}</p>
                  <p className="mt-1 text-sm text-muted">
                    {c.subject} · {BOXES[c.box - 1].label}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeCard(c.id)}
                  aria-label={`حذف البطاقة: ${c.q}`}
                  className="px-2 text-xl leading-none text-muted hover:text-margin"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function AddCardForm({ subjects, defaultSubject, onAdd, first }) {
  const [subject, setSubject] = useState(defaultSubject);
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [added, setAdded] = useState(false);
  const ready = subject.trim() && q.trim() && a.trim();
  const field =
    "w-full rounded-md border-2 border-grid bg-white px-3 py-2 focus:border-ink focus:outline-none";

  return (
    <section aria-labelledby="add-card">
      <h2 id="add-card" className="font-display text-xl font-bold">
        {first ? "اكتب أول بطاقة" : "أضف بطاقة"}
      </h2>
      {first && (
        <p className="mt-1 text-muted">
          في الوجه سؤال (تعريف، تاريخ، قانون…)، وفي الظهر الجواب.
        </p>
      )}
      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!ready) return;
          onAdd({ subject: subject.trim(), q: q.trim(), a: a.trim() });
          setQ("");
          setA("");
          setAdded(true);
        }}
      >
        <div>
          <label htmlFor="card-subject" className="mb-1 block font-medium">
            المادة
          </label>
          <input
            id="card-subject"
            list="card-subjects"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={40}
            placeholder="مثلاً: التاريخ والجغرافيا"
            className={field}
          />
          <datalist id="card-subjects">
            {subjects.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="card-q" className="mb-1 block font-medium">
            السؤال
          </label>
          <textarea
            id="card-q"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setAdded(false);
            }}
            rows={2}
            maxLength={300}
            placeholder="مثلاً: متى اندلعت الثورة التحريرية؟"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="card-a" className="mb-1 block font-medium">
            الجواب
          </label>
          <textarea
            id="card-a"
            value={a}
            onChange={(e) => setA(e.target.value)}
            rows={3}
            maxLength={600}
            placeholder="مثلاً: 1 نوفمبر 1954"
            className={field}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!ready}
            className="rounded-md bg-ink px-5 py-2 font-medium text-white disabled:opacity-40"
          >
            أضف البطاقة
          </button>
          {added && (
            <span className="text-sm text-muted" role="status">
              تمت إضافة البطاقة.
            </span>
          )}
        </div>
      </form>
    </section>
  );
}

function ReviewSession({ session, cards, onAnswer, onRetryHard, onClose }) {
  const [flipped, setFlipped] = useState(false);
  const total = session.queue.length;
  const byId = Object.fromEntries(cards.map((c) => [c.id, c]));

  // نهاية المراجعة
  if (session.index >= total) {
    const hard = session.queue.filter((id) => byId[id]?.box === 1).length;
    return (
      <section className="mt-8" aria-live="polite">
        <h2 className="font-display text-2xl font-bold text-ink">
          كمّلت المراجعة
        </h2>
        <p className="mt-3 text-lg">
          عرفت {session.knew} من {total} بطاقة.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {hard > 0 && (
            <button
              type="button"
              onClick={onRetryHard}
              className="rounded-md bg-ink px-5 py-2 font-medium text-white"
            >
              عاود الصعبة ({hard})
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border-2 border-ink px-5 py-2 font-medium text-ink"
          >
            الرجوع للبطاقات
          </button>
        </div>
      </section>
    );
  }

  const card = byId[session.queue[session.index]];
  if (!card) return null; // ما تصراش عادة: الحذف غير متاح أثناء المراجعة

  return (
    <section className="mt-8" aria-label="مراجعة البطاقات">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          {session.index + 1} / {total} · {card.subject}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="underline underline-offset-4"
        >
          إيقاف المراجعة
        </button>
      </div>

      <div className="notebook mt-3 min-h-64 rounded-lg border-2 border-grid">
        <div className="margin-line flex min-h-64 flex-col justify-center p-6 ps-8">
          <p className="text-sm text-muted">السؤال</p>
          <p className="mt-2 font-display text-2xl font-bold break-words text-ink">
            {card.q}
          </p>
          {flipped && (
            <div
              className="mt-6 border-t-2 border-dashed border-grid pt-4"
              aria-live="polite"
            >
              <p className="text-sm text-muted">الجواب</p>
              <p className="mt-2 text-lg break-words whitespace-pre-line">
                <span className="marker">{card.a}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {!flipped ? (
        <button
          type="button"
          onClick={() => setFlipped(true)}
          className="mt-4 w-full rounded-md bg-ink px-6 py-3 font-medium text-white"
        >
          اقلب البطاقة
        </button>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setFlipped(false);
              onAnswer(card.id, true);
            }}
            className="rounded-md bg-ink px-4 py-3 font-medium text-white"
          >
            عرفتها
          </button>
          <button
            type="button"
            onClick={() => {
              setFlipped(false);
              onAnswer(card.id, false);
            }}
            className="rounded-md border-2 border-margin px-4 py-3 font-medium text-margin"
          >
            ما عرفتهاش
          </button>
        </div>
      )}
    </section>
  );
}
