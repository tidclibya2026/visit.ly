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
  tripoliMaydan: "/manus-storage/tripoli-maydan_7264c46b.jpg",
  tripoliGates: "/manus-storage/tripoli-gates_54d39359.jpeg",
  tripoliMarcus: "/manus-storage/tripoli-marcus-arch_9f2515fa.jpg",
  ghadamesLanes: "/manus-storage/ghadames-white-lanes_d7722156.jpg",
  ghadamesCourtyard: "/manus-storage/ghadames-courtyard_9ee25085.jpg",
  ghadamesPassage: "/manus-storage/ghadames-passage_a89fd5ec.jpg",
  leptisColumns: "/manus-storage/leptis-columns_c2f32aec.jpg",
  leptisGalleryArch: "/manus-storage/leptis-arch_f62e4d6e.jpg",
  leptisRuins: "/manus-storage/leptis-ruins_01cdda21.jpeg",
  shahatColumns: "/manus-storage/shahat-columns_875b11df.jpg",
  shahatTemple: "/manus-storage/shahat-temple_7854b7e0.jpg",
  shahatTerrace: "/manus-storage/shahat-terrace_b06f1a7c.jpg",
  sabrathaTheatre: "/manus-storage/sabratha-theatre_ebea3ad6.jpg",
  sabrathaCoast: "/manus-storage/sabratha-coast_32de6532.jpeg",
  benghaziWaterfront: "/manus-storage/benghazi-waterfront_d713a797.jpg",
  benghaziCity: "/manus-storage/benghazi-city_c1cd5936.jpg",
  benghaziSunrise: "/manus-storage/benghazi-sunrise_6b6ea2eb.jpg",
  acacusRocks: "/manus-storage/acacus-rocks_649bff79.jpg",
  acacusArch: "/manus-storage/acacus-arch_1236df4f.jpeg",
  acacusSandstone: "/manus-storage/acacus-sandstone_e2dc33bf.jpeg",
} as const;

export type GalleryItem = {
  image: string;
  alt: string;
  caption: string;
  location: string;
  coordinates: string;
};

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
  gallery: GalleryItem[];
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
    gallery: [
      { image: assets.tripoliMaydan, alt: "مئذنة وميدان في طرابلس القديمة", caption: "ميدان الجزائر ضمن نسيج المدينة القديمة.", location: "طرابلس القديمة · ميدان الجزائر", coordinates: "32.887°N · 13.180°E" },
      { image: assets.tripoliGates, alt: "بوابة تاريخية في طرابلس القديمة", caption: "بوابة وأقواس تحفظ إيقاع الأزقة التاريخية.", location: "طرابلس القديمة · المسار الداخلي", coordinates: "32.892°N · 13.181°E" },
      { image: assets.tripoliMarcus, alt: "قوس ماركوس أوريليوس في طرابلس", caption: "قوس ماركوس أوريليوس، أحد معالم المدينة الكلاسيكية.", location: "طرابلس القديمة · قرب السرايا الحمراء", coordinates: "32.894°N · 13.180°E" },
    ],
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
    gallery: [
      { image: assets.benghaziWaterfront, alt: "واجهة بحرية في بنغازي", caption: "واجهة بحرية تكشف امتداد بنغازي على المتوسط.", location: "بنغازي · الواجهة البحرية", coordinates: "32.116°N · 20.067°E" },
      { image: assets.benghaziCity, alt: "مشهد حضري من بنغازي", caption: "تفاصيل المدينة بين الذاكرة الحضرية والساحل.", location: "بنغازي · قلب المدينة", coordinates: "32.113°N · 20.070°E" },
      { image: assets.benghaziSunrise, alt: "مشهد صباحي في بنغازي", caption: "ضوء الصباح فوق أفق المدينة الساحلي.", location: "بنغازي · شرق الواجهة", coordinates: "32.118°N · 20.080°E" },
    ],
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
    gallery: [
      { image: assets.ghadamesLanes, alt: "ممرات بيضاء ونخيل في غدامس", caption: "ممرات الواحة البيضاء تلتقي بالنخيل والظل.", location: "غدامس القديمة · الواحة", coordinates: "30.133°N · 9.501°E" },
      { image: assets.ghadamesCourtyard, alt: "فناء تقليدي في غدامس", caption: "فناء داخلي يعكس منطق الخصوصية والتهوية.", location: "غدامس القديمة · النسيج السكني", coordinates: "30.132°N · 9.498°E" },
      { image: assets.ghadamesPassage, alt: "ممر مظلل في غدامس", caption: "ممر مظلل صمّم ليخفف حرارة الصحراء.", location: "غدامس القديمة · ممرات المشاة", coordinates: "30.134°N · 9.500°E" },
    ],
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
    gallery: [
      { image: assets.acacusRocks, alt: "تكوينات صخرية في أكاكوس", caption: "تكوينات حجرية نحتتها الرياح عبر آلاف السنين.", location: "تادرارت أكاكوس · الصحراء الجنوبية الغربية", coordinates: "24.918°N · 10.676°E" },
      { image: assets.acacusArch, alt: "قوس صخري في أكاكوس", caption: "قوس طبيعي يرسم مدخلًا في صخور أكاكوس.", location: "تادرارت أكاكوس · المسارات الصخرية", coordinates: "24.930°N · 10.692°E" },
      { image: assets.acacusSandstone, alt: "صخور رملية في أكاكوس", caption: "طبقات حجر رملي بلون الصحراء المتبدل.", location: "تادرارت أكاكوس · نطاق الكثبان", coordinates: "24.905°N · 10.655°E" },
    ],
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
    gallery: [
      { image: assets.leptisGalleryArch, alt: "قوس روماني في لبدة الكبرى", caption: "قوس حجري يبرز دقة العمارة الرومانية في لبدة.", location: "لبدة الكبرى · المنطقة الأثرية", coordinates: "32.639°N · 14.290°E" },
      { image: assets.leptisColumns, alt: "أعمدة في لبدة الكبرى", caption: "أعمدة وبقايا ساحات عامة في المدينة الأثرية.", location: "لبدة الكبرى · الساحة الرومانية", coordinates: "32.638°N · 14.291°E" },
      { image: assets.leptisRuins, alt: "آثار ممتدة في لبدة الكبرى", caption: "مشهد بانورامي لبقايا المدينة قرب الساحل.", location: "لبدة الكبرى · المسار الساحلي", coordinates: "32.640°N · 14.293°E" },
    ],
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
    gallery: [
      { image: assets.shahatColumns, alt: "أعمدة أثرية في شحات", caption: "أعمدة كلاسيكية وسط طبيعة الجبل الأخضر.", location: "شحات / قورينا · المنطقة الأثرية", coordinates: "32.826°N · 21.862°E" },
      { image: assets.shahatTemple, alt: "معبد أثري في شحات", caption: "معبد وبقايا حجرية تروي طبقات قورينا التاريخية.", location: "شحات / قورينا · الحرم الأثري", coordinates: "32.824°N · 21.860°E" },
      { image: assets.shahatTerrace, alt: "مدرجات أثرية في شحات", caption: "مدرجات ومسارات حجرية تقود عبر الموقع الكلاسيكي.", location: "شحات / قورينا · المسار العلوي", coordinates: "32.828°N · 21.864°E" },
    ],
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
    gallery: [
      { image: assets.sabrathaTheatre, alt: "مسرح صبراتة الأثري", caption: "المسرح الأثري أحد أبرز مشاهد الموقع الساحلي.", location: "صبراتة · المنطقة الأثرية", coordinates: "32.800°N · 12.486°E" },
      { image: assets.sabrathaCoast, alt: "ساحل وآثار صبراتة", caption: "بقايا المدينة تتجاور مع خط المتوسط المفتوح.", location: "صبراتة · الواجهة الأثرية", coordinates: "32.799°N · 12.483°E" },
    ],
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
