import PageHeader from "../components/PageHeader";
import SiteFooter from "../components/SiteFooter";
import CardsBoard from "./CardsBoard";

export const metadata = {
  title: "بطاقات الحفظ | مخطط المراجعة",
};

export default function CardsPage() {
  return (
    <>
      <PageHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="py-10 ps-6 md:ps-10">
            <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
              بطاقات الحفظ
            </h1>
            <p className="mt-3 text-lg">
              اكتب سؤال وجوابه، وراجع بالتكرار. البطاقات لي ما تعرفهاش تعاود
              تجيك أولاً.
            </p>
            <CardsBoard />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
