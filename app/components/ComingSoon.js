import Link from "next/link";
import PageHeader from "./PageHeader";
import SiteFooter from "./SiteFooter";
import { sections } from "../sections";

// صفحة مؤقتة لقسم مازال قيد البناء
export default function ComingSoon({ href }) {
  const section = sections.find((s) => s.href === href);

  return (
    <>
      <PageHeader />
      <main className="notebook flex-1">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="margin-line py-16 ps-6 md:ps-10">
            <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
              {section.title}
            </h1>
            <p className="mt-4 text-lg text-text">{section.description}</p>
            <p className="mt-8 inline-block bg-highlight px-3 py-1 font-medium text-text">
              هذا القسم قيد البناء، يكون جاهز قريباً.
            </p>
            <div className="mt-8">
              <Link href="/" className="text-ink underline underline-offset-4">
                الرجوع للفهرس
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
