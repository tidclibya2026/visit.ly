/**
 * Design reminder — «دفاتر الرحّالة»: محتوى عربي تحريري دافئ، متدرّج مثل مسار رحلة،
 * يعتمد أزرق الجبل #174F64 ومساحات ورقية هادئة بدل البطاقات التجارية المتكررة.
 */

export const assets = {
  brandMark: "/manus-storage/visitlibya-logo-cropped_4628ce39.png",
  favicon: "/manus-storage/visitlibya-favicon_d185c209.png",
  atlasPublicUrl: "https://tidclibya2026.github.io/tidcatlas.ly/",
  visitLibyaPublicUrl: "https://tidclibya2026.github.io/visitlibya/",
  hero: "/manus-storage/hero-old-tripoli_a6480491.jpg",
  greenMountain: "/manus-storage/hero-green-coast_25dc4d32.jpg",
  craftTable: "/manus-storage/hero-ghadames-mosque_22defd16.jpg",
  desertCaravan: "/manus-storage/hero-desert-caravan_b6273f64.jpg",
  desertSky: "/manus-storage/hero-desert-sky_4e436a47.webp",
  leptisAerial: "/manus-storage/hero-leptis-aerial_3ae7244f.jpg",
  leptisArch: "/manus-storage/hero-leptis-arch_c1826808.jpeg",
  ghadamesPalm: "/manus-storage/hero-ghadames-palm_7c470fb3.jpg",
  ghadamesVerified: "/manus-storage/ghadames-verified_c72cbf9e.jpg",
  shahatVerified: "/manus-storage/shahat-cyrene-verified_37c78f9b.jpg",
  leptisVerified: "/manus-storage/leptis-magna-verified_6446900c.jpg",
  sabrathaVerified: "/manus-storage/sabratha-verified_83c524eb.jpg",
  leptis: "/manus-storage/leptis-magna_4bf38121.jpeg",
  leptisRoute: "/manus-storage/leptis-magna-route_c5a55a9d.jpg",
  ghadames: "/manus-storage/ghadames_873c8511.jpg",
  ghadamesRoute: "/manus-storage/ghadames-route_ba457c5b.jpg",
  sabratha: "/manus-storage/sabratha_de3c8153.jpg",
  sabrathaRoute: "/manus-storage/sabratha-route_2bf5a794.jpg",
  cyrene: "/manus-storage/cyrene_5eb9b95a.jpg",
  acacus: "/manus-storage/acacus_020865e5.jpg",
  acacusRoute: "/manus-storage/acacus-route_e5049673.jpg",
  benghazi: "/manus-storage/benghazi-route_8efbc028.jpg",
  oldTripoli: "/manus-storage/old-tripoli_5f4193ba.jpg",
  coast: "/manus-storage/mediterranean-coast_489967c3.jpg",
  couscous: "/manus-storage/libyan-couscous_d0b0155c.jpg",
  horseRiding: "/manus-storage/horse-riding-group_660e4f2a.jpg",
  traditionalDress: "/manus-storage/traditional-dress_15d6feff.jpg",
  pottery: "/manus-storage/traditional-jewellery_af0c9ac4.jpeg",
} as const;

export type Destination = {
  id: string;
  title: string;
  city: string;
  landmarkType: string;
  region: string;
  category: "مدينة" | "تراث" | "طبيعة" | "ساحل";
  time: string;
  description: string;
  image: string;
  alt: string;
};

export const destinations: Destination[] = [
  {
    id: "tripoli",
    title: "طرابلس القديمة",
    city: "طرابلس",
    landmarkType: "مدينة تاريخية",
    region: "الغرب الليبي",
    category: "مدينة",
    time: "نصف يوم إلى يوم",
    description: "أزقة وحوانيت وأسوار بحرية تقود إلى قوس ماركوس أوريليوس وتفاصيل مدينة عاشت قرونًا من التجارة والحكايات.",
    image: assets.oldTripoli,
    alt: "مشهد من المدينة القديمة في طرابلس",
  },
  {
    id: "benghazi",
    title: "بنغازي",
    city: "بنغازي",
    landmarkType: "مدينة ساحلية",
    region: "برقة",
    category: "مدينة",
    time: "يومان",
    description: "مدينة تجمع الحضور الحضري والذاكرة الثقافية وقرب الساحل، وتصلح محطة أولى لاستكشاف شرق ليبيا.",
    image: assets.benghazi,
    alt: "واجهة من مدينة بنغازي",
  },
  {
    id: "ghadames",
    title: "غدامس",
    city: "غدامس",
    landmarkType: "واحة ومعمار تقليدي",
    region: "الجنوب الغربي",
    category: "تراث",
    time: "يومان",
    description: "جوهرة الصحراء ببيوتها البيضاء وممراتها المظللة ونظامها العمراني الذي صاغته حياة الواحة.",
    image: assets.ghadamesVerified,
    alt: "ممر معماري ونخيل في المدينة القديمة بغدامس",
  },
  {
    id: "acacus",
    title: "تادرارت أكاكوس",
    city: "تادرارت أكاكوس",
    landmarkType: "طبيعة صحراوية",
    region: "الجنوب الغربي",
    category: "طبيعة",
    time: "3 أيام أو أكثر",
    description: "سلسلة صخرية صحراوية تضم لوحات وفنونًا صخرية قديمة، وتحتاج إلى تنظيم مناسب ومرشدين ذوي خبرة.",
    image: assets.acacusRoute,
    alt: "تكوينات صخرية في تادرارت أكاكوس",
  },
  {
    id: "leptis",
    title: "لبدة الكبرى",
    city: "الخمس",
    landmarkType: "موقع أثري روماني",
    region: "الساحل الغربي",
    category: "تراث",
    time: "نصف يوم إلى يوم",
    description: "قوس روماني مهيب وشوارع ومعالم عامة تكشف عن مدينة متوسطية ازدهرت على الساحل الليبي.",
    image: assets.leptisVerified,
    alt: "قوس روماني في موقع لبدة الكبرى الأثري",
  },
  {
    id: "shahat",
    title: "شحات / قورينا",
    city: "شحات",
    landmarkType: "موقع أثري إغريقي",
    region: "الجبل الأخضر",
    category: "تراث",
    time: "نصف يوم إلى يوم",
    description: "طبقات أثرية كلاسيكية تتجاور مع طبيعة الجبل الأخضر في موقع قورينا التاريخي.",
    image: assets.shahatVerified,
    alt: "آثار شحات أو قورينا وسط الغطاء النباتي",
  },
  {
    id: "sabratha",
    title: "صبراتة",
    city: "صبراتة",
    landmarkType: "موقع أثري روماني",
    region: "الساحل الغربي",
    category: "تراث",
    time: "نصف يوم إلى يوم",
    description: "المسرح الأثري يطل على المتوسط في مشهد يجمع العمارة الرومانية وامتداد الساحل.",
    image: assets.sabrathaVerified,
    alt: "مسرح صبراتة الأثري المطل على البحر",
  },
];

export const heroSlides = [
  { image: assets.oldTripoli, alt: "ساعة ميدان في المدينة القديمة بطرابلس", kicker: "طرابلس القديمة · 32°53′N", title: "ابدأ من الحكاية", accent: "واترك المكان يقودك.", description: "أزقة وميدان وذاكرة مدينة تُفتح منها رحلة الاكتشاف.", note: "محطة 01 · المدينة القديمة" },
  { image: assets.ghadamesVerified, alt: "عمارة المدينة القديمة في غدامس", kicker: "غدامس · 30°08′N", title: "في الواحة،", accent: "للظلّ حكاية.", description: "ممرات بيضاء ونخيل وعمارة صحراوية صاغتها حياة المكان.", note: "محطة 02 · عمارة الواحة" },
  { image: assets.leptisVerified, alt: "قوس روماني في لبدة الكبرى", kicker: "لبدة الكبرى · 32°38′N", title: "بين الأعمدة،", accent: "يمتد الزمن.", description: "أثر روماني على الساحل يقرأ تاريخ المتوسط من ليبيا.", note: "محطة 03 · لبدة الكبرى" },
  { image: assets.sabrathaVerified, alt: "مسرح صبراتة الأثري", kicker: "صبراتة · 32°48′N", title: "حيث يلتقي الأثر", accent: "بخط البحر.", description: "مسرح روماني وساحل مفتوح في واحد من أبرز مواقع الغرب الليبي.", note: "محطة 04 · صبراتة" },
  { image: assets.shahatVerified, alt: "آثار شحات وقورينا", kicker: "شحات / قورينا · 32°49′N", title: "على الجبل الأخضر،", accent: "تتنفّس الذاكرة.", description: "معابد ومسارات حجرية وسط الطبيعة في قورينا التاريخية.", note: "محطة 05 · شحات وقورينا" },
] as const;

export const heritageSites = [
  {
    title: "لبدة الكبرى",
    kicker: "مدينة رومانية على المتوسط",
    description: "مبانٍ عامة وشوارع وأعمدة تكشف عن مدينة رومانية كبرى ازدهرت على الساحل الليبي.",
    image: assets.leptisVerified,
    alt: "معلم أثري في لبدة الكبرى",
  },
  {
    title: "شحات / قورينا",
    kicker: "مدينة جبلية كلاسيكية",
    description: "معابد ومبانٍ ومقابر تؤرخ لطبقات من الحضارة الكلاسيكية في شمال أفريقيا.",
    image: assets.shahatVerified,
    alt: "آثار مدينة شحات أو قورينا",
  },
  {
    title: "صبراتة",
    kicker: "مسرح يطل على البحر",
    description: "بقايا مدينة ومسرح روماني يمنحان الساحل الغربي مشهدًا أثريًا متفردًا.",
    image: assets.sabrathaVerified,
    alt: "معلم أثري في صبراتة",
  },
  {
    title: "فنون أكاكوس الصخرية",
    kicker: "ذاكرة ما قبل التاريخ",
    description: "لوحات صخرية تسجل الإنسان والبيئة والمجتمعات عبر آلاف السنين في الصحراء.",
    image: assets.acacus,
    alt: "منطقة أكاكوس الصحراوية",
  },
  {
    title: "المدينة القديمة في غدامس",
    kicker: "عمارة الواحة",
    description: "ممرات مغطاة وبيوت طينية بيضاء تمثل حلًا معماريًا ذكيًا لحرارة الصحراء وحياة المجتمع.",
    image: assets.ghadamesVerified,
    alt: "واجهة من المدينة القديمة في غدامس",
  },
];

export const experiences = [
  { icon: "Landmark", title: "مدن وحضارات", text: "اتبع خطوط الإغريق والرومان والعصور الإسلامية عبر المواقع والأسواق والمدن القديمة." },
  { icon: "Mountain", title: "مسارات الطبيعة", text: "من الجبل الأخضر إلى الواحات وتكوينات الصحراء، اختر الطبيعة التي تود مشاهدتها." },
  { icon: "Utensils", title: "مذاقات محلية", text: "تعرّف إلى البازين والكسكسي والعصيدة والشاي وبهارات المطبخ الليبي في سياقها المحلي." },
  { icon: "Palette", title: "حرف وتقاليد", text: "اكتشف النحاسيات والنسيج والفخار والجلود ومهارات صاغتها أيدي الحرفيين عبر أجيال." },
  { icon: "TentTree", title: "الصحراء والواحات", text: "نظّم تجربتك الصحراوية مع مختصين محليين، واختر الموسم والمسار الأنسبين." },
  { icon: "CalendarDays", title: "مواسم وفعاليات", text: "تتغير التظاهرات بين الساحل والجبل والصحراء مع تغير الفصول ومواسم الربيع والحصاد." },
];

export const cultureTopics = [
  {
    title: "مائدة من روح المكان",
    kicker: "المطبخ الليبي",
    description: "مطبخ تتداخل فيه التأثيرات المتوسطية والعربية والصحراوية، وتظهر فيه الحبوب والصلصات والبهارات والشاي كجزء من الضيافة.",
    image: assets.couscous,
    alt: "كسكسي ليبي تقليدي",
  },
  {
    title: "ذاكرة تُروى وتُؤدّى",
    kicker: "التقاليد والفروسية",
    description: "موسيقى وأهازيج ومناسبات وفروسية شعبية تستحضر الذاكرة المشتركة وتعبّر عن الفرح والانتماء.",
    image: assets.horseRiding,
    alt: "مجموعة فرسان في فعالية تقليدية",
  },
  {
    title: "أثر اليد في كل تفصيل",
    kicker: "الصناعات التقليدية",
    description: "الحُلي الفضية والنحاسيات والنسيج والسعف والجلود تمنح الزائر فرصة للتعرف إلى حرف ما زالت حاضرة في الأسواق والمجتمعات.",
    image: assets.pottery,
    alt: "حُلي تقليدية ليبية فضية",
  },
];

export const practicalGuides = [
  {
    title: "قبل السفر",
    items: ["تحقق من صلاحية جواز السفر ووثائق الدخول قبل ترتيب الرحلة.", "ارجع دائمًا إلى المصادر والجهات الرسمية لمتطلبات التأشيرة وإجراءات الوصول.", "احرص على التأمين الصحي وخطة الإقامة والاتصال بمشغل الرحلات أو الجهة المستضيفة."],
  },
  {
    title: "داخل ليبيا",
    items: ["تتوفر خيارات إقامة بين الفنادق والشقق الفندقية والمخيمات والاستراحات بحسب المنطقة.", "تربط الطرق المدن، بينما تحتاج المسارات الصحراوية إلى وسائل مناسبة وترتيب مسبق.", "تنتشر خدمات الاتصال في المدن، وقد تتفاوت التغطية في المواقع البعيدة."],
  },
  {
    title: "المناخ والموسم",
    items: ["الساحل متوسطي المناخ، والجنوب صحراوي بفوارق حرارية ملحوظة بين الليل والنهار.", "يُفضَّل تنسيق الرحلات الصحراوية حسب الموسم والطقس، مع الاستعانة بجهات محلية مختصة.", "تتوزع المهرجانات والأنشطة بين فصلي الربيع والصيف على الساحل والجبل، وبين الخريف والربيع في المسارات الصحراوية."],
  },
];

export const journalSections = [
  "طرابلس مدينة الألف جولة",
  "الجبل الأخضر",
  "بنغازي",
  "غدامس",
  "لبدة الكبرى",
  "شحات وقورينا",
  "صبراتة",
  "تادرارت أكاكوس",
  "الأكلات الليبية",
  "الصناعات التقليدية",
  "التسوق",
  "الاستشفاء",
  "التظاهرات والمهرجانات",
  "العملة الوطنية",
];
