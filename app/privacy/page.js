import PageHeader from "../components/PageHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "الخصوصية | مخطط المراجعة",
};

export default function Privacy() {
  return (
    <>
      <PageHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-2xl px-4 py-12 leading-loose md:px-6">
          <h1 className="font-display text-3xl font-bold text-ink">
            بياناتك تبقى في جهازك
          </h1>

          <p className="mt-6">
            مخطط المراجعة ما يطلبش منك حساب، وما يجمعش اسمك ولا رقم هاتفك ولا
            بريدك. الدروس والجداول والبطاقات اللي تكتبها تتخزّن في متصفح جهازك
            فقط، وما توصلنا حتى معلومة منها.
          </p>

          <h2 className="mt-10 font-display text-xl font-bold text-text">
            واش لازم تعرف
          </h2>
          <ul className="mt-4 list-disc space-y-2 ps-6">
            <li>
              إذا مسحت بيانات المتصفح ولا بدّلت الهاتف، تضيع البيانات المحفوظة.
            </li>
            <li>
              البيانات المحفوظة في هاتف ما تظهرش في جهاز آخر.
            </li>
            <li>
              نخدمو على زر لحفظ نسخة من بياناتك واسترجاعها، باش تقدر تنقلها.
            </li>
          </ul>

          <h2 className="mt-10 font-display text-xl font-bold text-text">
            القانون
          </h2>
          <p className="mt-4">
            بما أن الأداة ما تجمعش معطيات ذات طابع شخصي، فهي ما تعالجهاش بالمعنى
            الوارد في القانون الجزائري رقم 18-07 المتعلق بحماية الأشخاص الطبيعيين
            في مجال معالجة المعطيات ذات الطابع الشخصي. إذا تبدّل هذا في المستقبل
            (مثلاً إضافة حسابات)، نحدّثو هذه الصفحة قبل أي تغيير.
          </p>

          <h2 className="mt-10 font-display text-xl font-bold text-text">
            التواصل
          </h2>
          <p className="mt-4">
            لأي سؤال:{" "}
            <a
              href="mailto:djellaldesignstudio@gmail.com"
              className="text-ink underline underline-offset-4"
            >
              djellaldesignstudio@gmail.com
            </a>
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
