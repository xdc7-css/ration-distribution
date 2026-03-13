نظام توزيع المواد الغذائية

هذا مشروع لوحة تحكم إدارية لإدارة عملية توزيع المواد الغذائية على العوائل.
النظام مبني باستخدام Next.js (App Router) مع TypeScript وTailwind CSS مع الاعتماد على Supabase كخدمة قاعدة البيانات والمصادقة، إضافة إلى SheetJS لتوليد ملفات Excel الخاصة بالتقارير.

الفكرة الأساسية من النظام هي توفير واجهة بسيطة للإدارة تسمح بإدارة العوائل والمواد الغذائية وتسجيل عمليات التوزيع الشهرية، مع الاحتفاظ بسجل تاريخي لكل عملية تسليم بحيث يمكن الرجوع إليها لاحقاً دون التأثير على البيانات الأصلية.

واجهة النظام مصممة بالكامل باللغة العربية مع اتجاه RTL، وتم الاهتمام بأن تكون الواجهة واضحة وسلسة للاستخدام اليومي داخل بيئة إدارية.

أهم المميزات

النظام يوفر تسجيل دخول إداري فقط باستخدام Supabase Auth بحيث لا يمكن الوصول للوحة التحكم دون مصادقة.
يمكن من خلاله إدارة العوائل المسجلة وعدد أفراد كل عائلة، إضافة المواد الغذائية المختلفة مع وحدات القياس الخاصة بها، ثم تنفيذ عملية التوزيع الشهري بطريقة شبه تلقائية اعتماداً على عدد الأفراد أو نوع المادة.

كل عملية توزيع يتم حفظها كسجل تاريخي مستقل (snapshot) حتى لو تغير عدد أفراد العائلة لاحقاً، وبذلك تبقى التقارير السابقة دقيقة ولا تتأثر بالتعديلات المستقبلية.

يتضمن النظام أيضاً صفحة تقارير تسمح بمراجعة عمليات التوزيع السابقة، بالإضافة إلى إمكانية تصدير البيانات إلى Excel سواء بشكل شامل أو حسب العائلة أو حسب الشهر.

المتطلبات

المشروع يعمل على بيئة Node.js حديثة (يفضل الإصدار 20 أو أحدث)، ويحتاج إلى مشروع Supabase جاهز لاستخدام قاعدة البيانات والمصادقة.
يمكن نشره بسهولة على Vercel أو أي منصة تدعم تشغيل تطبيقات Next.js.


هيكل المشروع

المشروع منظم بحيث تكون صفحات التطبيق داخل مجلد app باستخدام App Router الخاص بـ Next.js.
واجهة المستخدم والعناصر المشتركة موجودة داخل مجلد components، بينما الكود المسؤول عن الاتصال بقاعدة البيانات والعمليات المساعدة موجود داخل lib.
العمليات التي تنفذ على الخادم مثل إنشاء التوزيع أو تعديل البيانات موضوعة داخل مجلد server.

أما ملفات قاعدة البيانات الخاصة بـ Supabase فهي موجودة داخل مجلد supabase وتشمل تعريف الجداول وبعض البيانات

ration-distribution-admin/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── backups/
│   │       │   └── page.tsx
│   │       ├── distribution/
│   │       │   └── page.tsx
│   │       ├── families/
│   │       │   ├── [id]/
│   │       │   │   └── page.tsx
│   │       │   ├── new/
│   │       │   │   └── page.tsx
│   │       │   ├── actions.ts
│   │       │   └── page.tsx
│   │       ├── import/
│   │       │   └── page.tsx
│   │       ├── items/
│   │       │   └── page.tsx
│   │       ├── reports/
│   │       │   ├── actions.ts
│   │       │   └── page.tsx
│   │       ├── favicon.ico
│   │       ├── layout.tsx
│   │       └── page.tsx
│   │
│   ├── api/
│   │   └── export/
│   │       ├── all/
│   │       │   └── route.ts
│   │       ├── family/
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       └── monthly/
│   │           └── route.ts
│   │
│   ├── globals.css
│   ├── icon.png
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   │
│   ├── ui/
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── textarea.tsx
│   │
│   ├── distribution-client.tsx
│   ├── empty-state.tsx
│   ├── export-family-report-button.tsx
│   ├── family-form.tsx
│   ├── import-families-client.tsx
│   ├── item-form.tsx
│   ├── items-client-table.tsx
│   ├── report-export-buttons.tsx
│   └── stat-card.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── admin.ts
│   │   ├── client.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   │
│   ├── auth.ts
│   ├── constants.ts
│   ├── db.ts
│   ├── excel-reports.ts
│   ├── excel.ts
│   ├── types.ts
│   ├── utils.ts
│   └── validations.ts
│
├── server/
│   ├── auth-actions.ts
│   ├── distribution-actions.ts
│   ├── family-actions.ts
│   ├── import-actions.ts
│   └── item-actions.ts
│
├── supabase/
│   ├── schema.sql
│   └── seed.sql
│
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json