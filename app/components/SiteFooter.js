import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t-2 border-grid bg-paper">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p>
          بياناتك تبقى في جهازك.{" "}
          <Link href="/privacy" className="text-ink underline underline-offset-4">
            كيف نحمي خصوصيتك
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
            Djellal Design Studio
          </a>
        </p>
      </div>
    </footer>
  );
}
