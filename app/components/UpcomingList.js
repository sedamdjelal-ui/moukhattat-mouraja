import { upcoming } from "../updates";

// قائمة "قريباً": مربعات فارغة مثل قائمة مهام في الكراس
export default function UpcomingList() {
  return (
    <ul className="mt-6 space-y-4">
      {upcoming.map((u) => (
        <li key={u.title} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-1.5 size-4 shrink-0 rounded-sm border-2 border-muted"
          />
          <div>
            <p className="font-bold">{u.title}</p>
            <p className="text-muted">{u.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
