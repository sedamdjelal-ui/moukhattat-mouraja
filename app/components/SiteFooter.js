import Link from "next/link";

// رابط الاقتراحات: بدّله برابط صفحة الاقتراحات في djellalco.com كي تكون جاهزة
const SUGGEST_URL =
  "mailto:sedamdjellal@gmail.com?subject=اقتراح لمخطط المراجعة";

export default function SiteFooter() {
  return (
    <footer className="border-t-2 border-grid bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-muted md:px-6">
        <p className="mb-4 text-base text-text">
          عندك فكرة تعاونك في المراجعة؟{" "}
          <a
            href={SUGGEST_URL}
            className="font-medium text-ink underline underline-offset-4"
          >
            ابعثلنا اقتراحك
          </a>
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            بياناتك تبقى في جهازك.{" "}
            <Link
              href="/privacy"
              className="text-ink underline underline-offset-4"
            >
              كيف نحمي خصوصيتك
            </Link>
            {" · "}
            <Link
              href="/updates"
              className="text-ink underline underline-offset-4"
            >
              التحديثات
            </Link>
          </p>
          <p>
            من تصميم وتطوير{" "}
            <a
              href="https://www.djellalco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-4"
            >
              Sedam Djellal
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
