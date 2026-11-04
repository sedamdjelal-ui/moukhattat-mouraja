import PageHeader from "../components/PageHeader";
import SiteFooter from "../components/SiteFooter";
import ScheduleBoard from "./ScheduleBoard";

export const metadata = {
  title: "جدول المراجعة | مخطط المراجعة",
};

export default function SchedulePage() {
  return (
    <>
      <div className="print:hidden">
        <PageHeader />
      </div>
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="py-10 ps-6 md:ps-10 print:py-0 print:ps-0">
            <h1 className="font-display text-3xl font-bold text-ink md:text-4xl print:hidden">
              جدول المراجعة
            </h1>
            <p className="mt-3 text-lg print:hidden">
              اختر موادك ومعاملاتها، وحدّد وقتك، ونقسّملك المراجعة على الأسبوع.
            </p>
            <ScheduleBoard />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
