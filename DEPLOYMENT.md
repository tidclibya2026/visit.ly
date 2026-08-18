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

GitHub Pages يستضيف ملفات ثابتة فقط. يمكنه عرض `dist/public/index.html` كمعاينة للواجهة، لكنه لا يشغّل خادم Express أو tRPC أو قاعدة البيانات أو الترجمة والصوت. لذلك يبقى النشر الرسمي المناسب للمنصة الكاملة عبر استضافة Manus، مع استخدام GitHub كمستودع مصدر، ومراجعة، وتكامل مستمر.

> لا تعتمد GitHub Pages للنطاق الرسمي إذا كانت ميزات المساعد أو الخرائط أو المصادقة أو قاعدة البيانات مطلوبة؛ استخدم نطاق المشروع المنشور من Manus ثم اربطه بـ `visit.ly` من إعدادات النطاقات.
