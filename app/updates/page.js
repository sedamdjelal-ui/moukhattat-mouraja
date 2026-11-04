import PageHeader from "../components/PageHeader";
import SiteFooter from "../components/SiteFooter";
import UpcomingList from "../components/UpcomingList";
import { changelog, formatDate } from "../updates";

export const metadata = {
  title: "التحديثات | مخطط المراجعة",
};

export default function UpdatesPage() {
  return (
    <>
      <PageHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="py-10 ps-6 md:ps-10">
            <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
              التحديثات
            </h1>
            <p className="mt-3 text-lg">واش تزاد في الأداة، وواش نخدمو عليه.</p>

            <section aria-labelledby="soon" className="mt-10">
              <h2 id="soon" className="font-display text-xl font-bold">
                قريباً
              </h2>
              <UpcomingList />
              <p className="mt-6 text-muted">
                عندك فكرة تعاونك في المراجعة؟{" "}
                <a
                  href="mailto:sedamdjellal@gmail.com?subject=اقتراح لمخطط المراجعة"
                  className="text-ink underline underline-offset-4"
                >
                  ابعثلنا اقتراحك
                </a>
              </p>
            </section>

            <section aria-labelledby="log" className="mt-12">
              <h2 id="log" className="font-display text-xl font-bold">
                ما تم نشره
              </h2>
              <ol className="mt-6 space-y-8">
                {changelog.map((entry) => (
                  <li key={entry.date} className="margin-line pe-0 ps-5">
                    <time dateTime={entry.date} className="text-sm text-muted">
                      {formatDate(entry.date)}
                    </time>
                    <h3 className="mt-1 text-lg font-bold">{entry.title}</h3>
                    <ul className="mt-2 list-disc space-y-1 ps-5">
                      {entry.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
