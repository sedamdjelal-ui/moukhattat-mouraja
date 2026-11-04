import Link from "next/link";
import SiteFooter from "./components/SiteFooter";
import { sections } from "./sections";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        {/* صفحة الكراس: العنوان مكتوب على ورق بمربعات */}
        <section className="notebook border-b-2 border-grid">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <div className="margin-line py-16 ps-6 md:py-24 md:ps-10">
              <h1 className="font-display text-4xl leading-tight font-bold text-ink md:text-6xl">
                نظّم مراجعتك،
                <br />
                وما يفوتك حتى درس.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-loose text-text">
                لطلاب الثانوي والجامعة: قائمة دروسك، جدول مراجعتك، وبطاقات الحفظ
                في مكان واحد. مجانية، بلا حساب، وكل ما تكتبو يبقى في هاتفك.
              </p>
              <Link
                href={sections[0].href}
                className="mt-8 inline-block rounded-md bg-ink px-6 py-3 font-medium text-white shadow-[4px_4px_0_var(--highlight)] transition-transform hover:-translate-y-0.5"
              >
                ابدأ بقائمة الدروس
              </Link>
            </div>
          </div>
        </section>

        {/* الفهرس: مثل أول صفحة في الكراس */}
        <section className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="py-12 ps-6 md:ps-10">
            <h2 className="font-display text-2xl font-bold text-text">
              الفهرس
            </h2>
            <ol className="mt-6 space-y-6">
              {sections.map((s, i) => (
                <li key={s.href}>
                  <Link href={s.href} className="group block">
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold text-text group-hover:text-ink">
                        {s.title}
                      </span>
                      <span className="leader" aria-hidden="true" />
                      <span className="text-sm text-muted">
                        {s.ready ? `صفحة ${i + 1}` : "قريباً"}
                      </span>
                    </div>
                    <p className="mt-1 text-muted">{s.description}</p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
