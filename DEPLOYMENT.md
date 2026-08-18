# نشر منصة Visit Libya

## نقطة الدخول الرئيسية

ملف HTML الرئيسي للواجهة هو [`client/index.html`](client/index.html). يشغّل هذا الملف تطبيق React عبر [`client/src/main.tsx`](client/src/main.tsx)، ثم ينتج أمر البناء `pnpm build` الملف النهائي في `dist/public/index.html`.

| الغرض | الملف أو الأمر |
| --- | --- |
| نقطة دخول المتصفح | `client/index.html` |
| إقلاع React | `client/src/main.tsx` |
| خادم التطبيق وواجهات API | `server/_core/index.ts` |
| إنشاء نسخة الإنتاج | `pnpm build` |
| تشغيل نسخة الإنتاج الكاملة | `pnpm start` |

## GitHub Actions

الملف [`.github/workflows/ci.yml`](.github/workflows/ci.yml) يعمل تلقائيًا عند كل تحديث للفرع `main` أو عند فتح طلب دمج. وهو يشغّل فحص TypeScript واختبارات Vitest والبناء الإنتاجي، ثم يحفظ نسخة واجهة العميل الناتجة كأثر بناء قابل للتنزيل لمدة سبعة أيام.

## GitHub Pages وحدود النشر

ينشر الملف [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) نسخة ثابتة تلقائيًا إلى GitHub Pages عند كل تحديث للفرع `main`. يستخدم الأمر `pnpm build:pages` قاعدة مسار `/visit.ly/`، وينشئ `404.html` لاستيعاب مسارات React، ويستبدل روابط صور الأرشيف النسبية بعنوان استضافة Manus العام حتى لا تختفي الصور من معاينة GitHub Pages.

من **Settings → Pages** في GitHub، اختر **Source: GitHub Actions**. لا تختَر النشر من الفرع `main` أو الجذر؛ فعند اختيار ذلك ستظهر صفحة README بدل واجهة الموقع. بعد رفع هذا التحديث، راقب سير عمل **Deploy Visit Libya static preview to GitHub Pages** في تبويب Actions، ثم افتح `https://tidclibya2026.github.io/visit.ly/`.

GitHub Pages يستضيف ملفات ثابتة فقط. لا يشغّل خادم Express أو tRPC أو قاعدة البيانات أو الترجمة والصوت. لذلك يبقى النشر الرسمي المناسب للمنصة الكاملة عبر استضافة Manus، مع استخدام GitHub Pages كمعاينة للواجهة وGitHub كمستودع مصدر ومراجعة وتكامل مستمر.

> لا تعتمد GitHub Pages للنطاق الرسمي إذا كانت ميزات المساعد أو الخرائط أو المصادقة أو قاعدة البيانات مطلوبة؛ استخدم نطاق المشروع المنشور من Manus ثم اربطه بـ `visit.ly` من إعدادات النطاقات.
