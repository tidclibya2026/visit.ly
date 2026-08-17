/**
 * Design reminder — «دفاتر الرحّالة»: محتوى عربي تحريري دافئ، متدرّج مثل مسار رحلة،
 * يعتمد أزرق الجبل #174F64 ومساحات ورقية هادئة بدل البطاقات التجارية المتكررة.
 */

export const assets = {
  brandMark: "/manus-storage/visitlibya-logo-cropped_4628ce39.png",
  favicon: "/manus-storage/visitlibya-favicon_d185c209.png",
  atlasPublicUrl: "https://tidclibya2026.github.io/tidcatlas.ly/",
  visitLibyaPublicUrl: "https://tidclibya2026.github.io/visitlibya/",
  hero: "/manus-storage/libya-hero-travel-journal_2eb3d5ab.jpg",
  greenMountain: "/manus-storage/libya-green-mountain-editorial_25008626.jpg",
  craftTable: "/manus-storage/libya-culture-craft-editorial_8130ac77.jpg",
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
  pottery: "/manus-storage/traditional-pottery_9e613b56.jpg",
} as const;

export type Destination = {
  id: string;
  title: string;
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
    region: "الجنوب الغربي",
    category: "تراث",
    time: "يومان",
    description: "جوهرة الصحراء ببيوتها البيضاء وممراتها المظللة ونظامها العمراني الذي صاغته حياة الواحة.",
    image: assets.ghadamesRoute,
    alt: "عمارة غدامس التقليدية",
  },
  {
    id: "acacus",
    title: "تادرارت أكاكوس",
    region: "الجنوب الغربي",
    category: "طبيعة",
    time: "3 أيام أو أكثر",
    description: "سلسلة صخرية صحراوية تضم لوحات وفنونًا صخرية قديمة، وتحتاج إلى تنظيم مناسب ومرشدين ذوي خبرة.",
    image: assets.acacusRoute,
    alt: "تكوينات صخرية في تادرارت أكاكوس",
  },
];

export const heritageSites = [
  {
    title: "لبدة الكبرى",
    kicker: "مدينة رومانية على المتوسط",
    description: "مبانٍ عامة وشوارع وأعمدة تكشف عن مدينة رومانية كبرى ازدهرت على الساحل الليبي.",
    image: assets.leptisRoute,
    alt: "معلم أثري في لبدة الكبرى",
  },
  {
    title: "شحات / قورينا",
    kicker: "مدينة جبلية كلاسيكية",
    description: "معابد ومبانٍ ومقابر تؤرخ لطبقات من الحضارة الكلاسيكية في شمال أفريقيا.",
    image: assets.cyrene,
    alt: "آثار مدينة شحات أو قورينا",
  },
  {
    title: "صبراتة",
    kicker: "مسرح يطل على البحر",
    description: "بقايا مدينة ومسرح روماني يمنحان الساحل الغربي مشهدًا أثريًا متفردًا.",
    image: assets.sabratha,
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
    image: assets.ghadames,
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
    description: "النحاسيات والفخار والنسيج والسعف والجلود تمنح الزائر فرصة للتعرف إلى حرف ما زالت حاضرة في الأسواق والمجتمعات.",
    image: assets.pottery,
    alt: "قطع فخار تقليدية",
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
