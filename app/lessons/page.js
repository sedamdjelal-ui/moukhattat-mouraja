import PageHeader from "../components/PageHeader";
import SiteFooter from "../components/SiteFooter";
import LessonsBoard from "./LessonsBoard";

export const metadata = {
  title: "قائمة الدروس | مخطط المراجعة",
};

export default function LessonsPage() {
  return (
    <>
      <PageHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="py-10 ps-6 md:ps-10">
            <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
              قائمة الدروس
            </h1>
            <p className="mt-3 text-lg">
              سجّل دروس كل مادة، وعلّم على لي كمّلت مراجعتها.
            </p>
            <LessonsBoard />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
