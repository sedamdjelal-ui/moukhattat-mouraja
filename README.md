# مخطط المراجعة

أداة ويب مجانية لطلاب الثانوي والجامعة لتنظيم المراجعة: قائمة الدروس، جدول المراجعة، وبطاقات الحفظ.
بلا حساب، وكل البيانات تبقى في جهاز المستخدم (localStorage).

من تصميم وتطوير [Djellal Design Studio](https://www.djellalco.com).

## التشغيل محلياً

```bash
npm install
npm run dev
```

ثم افتح http://localhost:3000

## التقنيات

- Next.js (App Router) + Tailwind CSS
- الخطوط محفوظة داخل المشروع: IBM Plex Sans Arabic و Reem Kufi (رخصة SIL OFL، في `app/fonts`)

## مراحل البناء

1. الواجهة الرئيسية وصفحة الخصوصية ✅
2. قائمة الدروس والتقدم ✅
3. جدول المراجعة ✅
4. بطاقات الحفظ
5. النشر على Vercel وإضافته لمعرض djellalco.com
