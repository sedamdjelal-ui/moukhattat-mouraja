// منطق توزيع وقت المراجعة على أيام الأسبوع (بدون واجهة، سهل الاختبار)

// الأسبوع يبدأ يوم السبت
export const DAYS = [
  { key: "sat", name: "السبت" },
  { key: "sun", name: "الأحد" },
  { key: "mon", name: "الإثنين" },
  { key: "tue", name: "الثلاثاء" },
  { key: "wed", name: "الأربعاء" },
  { key: "thu", name: "الخميس" },
  { key: "fri", name: "الجمعة" },
];

export const UNIT = 30; // أصغر وحدة وقت: 30 دقيقة
const BLOCK_UNITS = 2; // طول الحصة العادية: ساعة (وحدتين)

// عرض المدة: 90 ← "1 سا 30 د"
export function formatMinutes(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h} سا ${m} د`;
  if (h) return `${h} سا`;
  return `${m} د`;
}

// نوزّع عدد الحصص على المواد حسب المعامل (طريقة أكبر باقي)
function shareUnits(subjects, totalUnits) {
  const coefSum = subjects.reduce((sum, s) => sum + s.coef, 0);
  const rows = subjects.map((s) => {
    const exact = (totalUnits * s.coef) / coefSum;
    return { id: s.id, units: Math.floor(exact), rest: exact % 1 };
  });
  let left = totalUnits - rows.reduce((sum, r) => sum + r.units, 0);
  [...rows]
    .sort((a, b) => b.rest - a.rest)
    .forEach((r) => {
      if (left > 0) {
        r.units += 1;
        left -= 1;
      }
    });
  return Object.fromEntries(rows.map((r) => [r.id, r.units]));
}

// يرجع لكل يوم قائمة حصص: [{ subjectId, minutes }]
// المادة لي باقيلها وقت أكثر تجي أولاً، وما نعاودوش نفس المادة مرتين ورا بعض
// في نفس اليوم إلا إذا ما كانش حل آخر. الحصص المتتالية لنفس المادة تتجمع.
export function buildPlan(subjects, hours) {
  const plan = Object.fromEntries(DAYS.map((d) => [d.key, []]));
  const active = subjects.filter((s) => s.coef > 0);
  if (active.length === 0) return plan;

  const dayUnits = DAYS.map((d) => ({
    key: d.key,
    units: Math.round(((hours[d.key] || 0) * 60) / UNIT),
  }));
  const total = dayUnits.reduce((sum, d) => sum + d.units, 0);
  if (total === 0) return plan;

  const remaining = shareUnits(active, total);
  // ترتيب ثابت عند التساوي: حسب ترتيب المواد في القائمة
  const order = Object.fromEntries(active.map((s, i) => [s.id, i]));

  for (const day of dayUnits) {
    let last = null;
    let left = day.units;
    const usedToday = new Set();
    while (left > 0) {
      const candidates = active
        .filter((s) => remaining[s.id] > 0)
        .sort(
          (a, b) =>
            // نفضّل مادة ما راجعناهاش اليوم، ومن بعد لي باقيلها أكثر
            Number(usedToday.has(a.id)) - Number(usedToday.has(b.id)) ||
            remaining[b.id] - remaining[a.id] ||
            order[a.id] - order[b.id],
        );
      if (candidates.length === 0) break;
      const pick = candidates.find((s) => s.id !== last) || candidates[0];
      // حصة واحدة = ساعة (أو أقل إذا ما بقاش وقت)
      const take = Math.min(BLOCK_UNITS, remaining[pick.id], left);
      remaining[pick.id] -= take;
      left -= take;
      usedToday.add(pick.id);

      const blocks = plan[day.key];
      const prev = blocks[blocks.length - 1];
      if (prev && prev.subjectId === pick.id) prev.minutes += take * UNIT;
      else blocks.push({ subjectId: pick.id, minutes: take * UNIT });
      last = pick.id;
    }
  }
  return plan;
}

// مجموع دقائق كل مادة في الأسبوع
export function weeklyTotals(plan) {
  const totals = {};
  for (const blocks of Object.values(plan)) {
    for (const b of blocks) {
      totals[b.subjectId] = (totals[b.subjectId] || 0) + b.minutes;
    }
  }
  return totals;
}
