import Link from "next/link";

// شريط علوي بسيط للصفحات الداخلية: اسم الأداة يرجع للرئيسية
export default function PageHeader() {
  return (
    <header className="border-b-2 border-grid bg-paper">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="font-display text-xl font-bold text-ink">
          مخطط المراجعة
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-ink">
          الرجوع للفهرس
        </Link>
      </div>
    </header>
  );
}
