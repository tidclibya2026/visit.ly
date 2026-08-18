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
  centerAsida: "/manus-storage/Eating_Asida_916ed906.jpg",
  centerAsban: "/manus-storage/center-asban_7fa2311c.png",
  centerMbakbaka: "/manus-storage/center-mbakbaka_1e575414.png",
  centerMaqroud: "/manus-storage/center-maqroud_48aa446e.jpg",
  centerFolklore: "/manus-storage/popular practices_318e8700.jpg",
  centerCrafts: "/manus-storage/traditional industries_bf2301f0.jpg",
  centerDress: "/manus-storage/traditional clothing_3fb46d2c.jpg",
  centerPottery: "/manus-storage/pottery2_7bee0a0c.jpg",
  ubariLakes: "/manus-storage/natural lakes_2bf6d930.jpg",
  awjila: "/manus-storage/awajla_06f0da52.jpg",
  qasrAlhajj: "/manus-storage/center-qasr-alhajj_0e3cef8b.jpg",
  rasHilal: "/manus-storage/photo_5765038270055563281_y_3e2ad3aa.jpg",
  tolmeitha: "/manus-storage/DJI_0044_7d839df8.JPG",
  sabrathaCenter: "/manus-storage/Sabratha1_62c274ee.jpg",
  villaSelene: "/manus-storage/11671060_5b1d3a15.jpg",
  qasrLibyaMosaic: "/manus-storage/center-qasr-libya-mosaic_695c80b6.jpg",
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
  fieldNote: string;
  highlights: string[];
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
    fieldNote: "مدينة طبقتها التجارة والعمارة العثمانية والرومانية حول الأزقة والأسواق وقوس ماركوس أوريليوس.",
    highlights: ["المدينة القديمة والأسواق", "قوس ماركوس أوريليوس", "السرايا الحمراء والواجهة البحرية"],
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
    fieldNote: "مدينة ساحلية تشكل نقطة انطلاق إلى الجبل الأخضر، وتجمع الذاكرة الثقافية بالواجهة البحرية.",
    highlights: ["الكورنيش والواجهة البحرية", "ساحة الشهداء والذاكرة الحضرية", "بوابة نحو شحات وسوسة والجبل الأخضر"],
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
    fieldNote: "عمارة واحة تقوم على الممرات المظللة والبيوت البيضاء وتوازن دقيق مع مناخ الصحراء.",
    highlights: ["ممرات مغطاة ومنازل تقليدية", "النخيل وحياة الواحة", "متحف غدامس والحِرف المحلية"],
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
    fieldNote: "منطقة للفن الصخري والتكوينات الطبيعية والوديان؛ تتطلب رحلة منظمة مع مختصين محليين.",
    highlights: ["الفن الصخري والكهوف", "الأقواس والتكوينات الصخرية", "السفاري والتخييم والرحلات بالإبل"],
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
    fieldNote: "مدينة متوسطية أثرية تتكشف عبر الأقواس والساحات والأعمدة وبقايا التخطيط الروماني.",
    highlights: ["الأقواس والساحات العامة", "الشوارع والمعالم الرومانية", "الموقع الأثري القريب من الساحل"],
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
    fieldNote: "تتجاور آثار قورينا الكلاسيكية مع غابات الجبل الأخضر وعيونه ومساراته الطبيعية.",
    highlights: ["المعابد والمدرجات الكلاسيكية", "الغابات والغطاء النباتي", "نبع أبولو ومسارات الجبل الأخضر"],
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
    fieldNote: "موقع أثري ساحلي يربط المسرح الروماني ببقايا المدينة وامتداد المتوسط.",
    highlights: ["المسرح الأثري", "بقايا المدينة الرومانية", "المشهد الساحلي"],
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
  {
    title: "طلميثة",
    kicker: "طبقات مدينة أثرية قرب الساحل",
    description: "تظهر صور المركز امتداد الموقع الأثري من منظور واسع، في محطة تصل تاريخ برقة بمشهد الساحل والسهول المجاورة.",
    image: assets.tolmeitha,
    alt: "منظر جوي موثق لموقع طلميثة الأثري من أرشيف المركز",
  },
  {
    title: "فيلا سيلين",
    kicker: "فسيفساء من الذاكرة الكلاسيكية",
    description: "تسجل مادة المركز تفاصيل فسيفسائية من الموقع، وتفتح نافذة على فنون الزخرفة والحياة في المواقع الأثرية الساحلية.",
    image: assets.villaSelene,
    alt: "فسيفساء موثقة من فيلا سيلين ضمن أرشيف المركز",
  },
  {
    title: "متحف قصر ليبيا",
    kicker: "ذاكرة الفسيفساء",
    description: "تُظهر مجموعة المركز نماذج من الفسيفساء المعروضة في قصر ليبيا، بوصفها مدخلًا بصريًا لقراءة طبقات الفن والتراث.",
    image: assets.qasrLibyaMosaic,
    alt: "فسيفساء من متحف قصر ليبيا ضمن أرشيف المركز",
  },
  {
    title: "قصر الحاج",
    kicker: "عمارة محلية على طريق الجبل",
    description: "تقود صورة المركز إلى قصر الحاج بوصفه محطة معمارية ضمن مسارات الجبل الغربي، حيث تحضر البنية المحلية والحكاية المكانية.",
    image: assets.qasrAlhajj,
    alt: "قصر الحاج من صور المركز الموثقة",
  },
  {
    title: "أوجلة",
    kicker: "واحة ومسارات من الطين والنخيل",
    description: "صورة موثقة من أرشيف المركز لواحة أوجلة، تفتح مجالًا لقراءة عمارة الواحة وصلتها بالزراعة والطرق الداخلية.",
    image: assets.awjila,
    alt: "عمارة واحة أوجلة من أرشيف المركز",
  },
  {
    title: "بحيرات أوباري الطبيعية",
    kicker: "ماء وصحراء في مشهد واحد",
    description: "تسجل صور المركز بحيرات أوباري الطبيعية ضمن نطاق الصحراء، وهي محطة بصرية تحتاج إلى تخطيط ميداني مناسب ومختصين محليين.",
    image: assets.ubariLakes,
    alt: "بحيرات أوباري الطبيعية من أرشيف المركز",
  },
];

export type Experience = {
  id: string;
  icon: "Landmark" | "Mountain" | "Utensils" | "Palette" | "TentTree" | "CalendarDays";
  title: string;
  text: string;
  image: string;
  alt: string;
  region: string;
  targetDestinationId: Destination["id"];
  targetRoute: string;
  targetPlace: string;
  season: string;
  seasonNote: string;
};

export const experiences: Experience[] = [
  { id: "heritage-leptis", icon: "Landmark", title: "مدن وحضارات", text: "اقرأ طبقات المدينة المتوسطية عبر الأقواس والساحات والأعمدة في واحد من أبرز المواقع الأثرية على الساحل.", image: assets.leptisVerified, alt: "قوس روماني في موقع لبدة الكبرى الأثري", region: "الساحل الغربي", targetDestinationId: "leptis", targetRoute: "/destinations/leptis", targetPlace: "لبدة الكبرى · الخمس", season: "الخريف والربيع", seasonNote: "طقس ألطف للمشي بين المعالم المفتوحة." },
  { id: "nature-shahat", icon: "Mountain", title: "مسارات الطبيعة", text: "اجمع بين آثار قورينا وامتداد الجبل الأخضر في محطة تقرأ الطبيعة والتاريخ معًا.", image: assets.greenMountain, alt: "ساحل الجبل الأخضر كما ورد في صور المنصة", region: "الجبل الأخضر", targetDestinationId: "shahat", targetRoute: "/destinations/shahat", targetPlace: "شحات / قورينا · الجبل الأخضر", season: "الربيع والخريف", seasonNote: "مناسب للمسارات الخارجية والغطاء النباتي." },
  { id: "flavours-tripoli", icon: "Utensils", title: "مذاقات محلية", text: "تعرف إلى المائدة الليبية عبر أطباق مثل المبكبكة والعصبان والعصيدة والحلويات، ضمن سياق الأسواق والضيافة في المدينة.", image: assets.centerMbakbaka, alt: "طبق مبكبكة ليبي من صور المركز", region: "الغرب الليبي", targetDestinationId: "tripoli", targetRoute: "/destinations/tripoli", targetPlace: "طرابلس القديمة · الأسواق", season: "على مدار العام", seasonNote: "تجربة مرنة ضمن برنامج المدينة." },
  { id: "crafts-ghadames", icon: "Palette", title: "حرف وتقاليد", text: "اقرأ قصة الصنعة عبر الفخار والمنسوجات والزخارف ومهارات الحرفيين، مع محطة مرتبطة بعمارة الواحة وأسواقها.", image: assets.centerCrafts, alt: "صناعات تقليدية ليبية من صور المركز", region: "الجنوب الغربي", targetDestinationId: "ghadames", targetRoute: "/destinations/ghadames", targetPlace: "غدامس القديمة · الحِرف المحلية", season: "الخريف والربيع", seasonNote: "أكثر راحة لزيارة الواحة والأسواق." },
  { id: "desert-acacus", icon: "TentTree", title: "الصحراء والواحات", text: "خطط لمسار منظّم بين الأقواس والتكوينات والفن الصخري، مع مختصين محليين وتجهيز مناسب للصحراء.", image: assets.acacusRoute, alt: "تكوينات صخرية في تادرارت أكاكوس من صور المنصة", region: "الجنوب الغربي", targetDestinationId: "acacus", targetRoute: "/destinations/acacus", targetPlace: "تادرارت أكاكوس · الجنوب الغربي", season: "أكتوبر إلى أبريل", seasonNote: "الفترة الأنسب عمومًا للمسارات الصحراوية." },
  { id: "season-benghazi", icon: "CalendarDays", title: "مواسم وفعاليات", text: "رتب التوقفات الساحلية والأنشطة الاجتماعية وفق الموسم، ثم راجع الجهة المنظمة قبل تثبيت أي موعد.", image: assets.centerFolklore, alt: "ممارسات شعبية وفروسية من صور المركز", region: "برقة", targetDestinationId: "benghazi", targetRoute: "/destinations/benghazi", targetPlace: "بنغازي · الواجهة والمدينة", season: "الربيع والصيف", seasonNote: "تابع البرنامج المحلي والطقس قبل الزيارة." },
  { id: "celebrations-tripoli", icon: "CalendarDays", title: "أفراح ومناسبات", text: "تعرّف إلى حضور الزي التقليدي والممارسات الاجتماعية في مناسبات الفرح، مع احترام خصوصية المناسبة وسؤال الجهة المضيفة قبل التصوير.", image: assets.centerDress, alt: "زي تقليدي من صور المركز", region: "الغرب الليبي", targetDestinationId: "tripoli", targetRoute: "/destinations/tripoli", targetPlace: "طرابلس · فضاءات الثقافة والمجتمع", season: "على مدار العام", seasonNote: "تتحدد فرص المشاهدة والمشاركة بدعوة وترتيب محلي." },
];

export const cultureTopics = [
  {
    title: "المطبخ والضيافة",
    kicker: "المطبخ الليبي",
    description: "تظهر صور المركز العصيدة والعصبان والمبكبكة والمقروض ضمن مائدة تتبدل من منطقة إلى أخرى، وتبقى الضيافة خيطها المشترك.",
    image: assets.centerAsida,
    alt: "عصيدة ليبية من صور المركز",
  },
  {
    title: "فلكلور وممارسات شعبية",
    kicker: "المناسبات والذاكرة الحية",
    description: "تسجل المادة المصورة ممارسات شعبية وفروسية وملابس احتفالية، لتقرب الزائر من حكاية المجتمع دون فصلها عن احترام خصوصية المناسبة.",
    image: assets.centerFolklore,
    alt: "ممارسات شعبية وفروسية من صور المركز",
  },
  {
    title: "صناعة وفخار ومنسوجات",
    kicker: "الصناعات التقليدية",
    description: "الفخار والمنسوجات والزخارف اليدوية تمنح الزائر مدخلًا ملموسًا إلى مهارات تتوارثها المجتمعات والأسواق المحلية.",
    image: assets.centerCrafts,
    alt: "صناعات تقليدية ليبية من صور المركز",
  },
  {
    title: "الزي والأفراح",
    kicker: "تفاصيل الفرح المحلي",
    description: "يحضر الزي التقليدي في الأفراح والمناسبات بوصفه ذاكرة بصرية واجتماعية؛ استمتع بالمشاهدة واطلب الإذن قبل التصوير أو المشاركة.",
    image: assets.centerDress,
    alt: "زي تقليدي ليبي من صور المركز",
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

export const culturalGuides = [
  { section: "مذاقات", title: "مائدة ليبية متعددة المناطق", text: "يتداخل المطبخ المتوسطي مع مذاقات البحر والصحراء والحبوب والبهارات، وتتغير بعض الأطباق بحسب المنطقة والموسم.", items: ["العصيدة والبازين ضمن أطباق الحبوب والمرق", "العصبان والمبكبكة كأطباق حاضرة في الذاكرة الشعبية", "المقروض والحلويات في ضيافة المناسبات", "اسأل عن المكوّنات والحساسية قبل التذوق"] },
  { section: "حِرف", title: "ما تحكيه اليد والصنعة", text: "تظهر الحرفة الليبية في منتجات تستجيب للبيئة والحياة اليومية وتحتفظ بالزخارف والمهارات المتوارثة.", items: ["الفخار وأواني الاستخدام اليومي", "المنسوجات والزخارف اليدوية", "الحُلي والنحاسيات في الأسواق", "دعم الحرفيين والسؤال عن قصة القطعة"] },
  { section: "فلكلور", title: "مواسم وفرح محلي", text: "تتجلى الأهازيج والممارسات والملابس التقليدية في الفعاليات الاجتماعية والثقافية ومواسم الفرح.", items: ["الفروسية والممارسات الشعبية", "الأفراح والملابس التقليدية", "فعاليات بحرية وصحراوية وفق الموسم", "احترام خصوصية المناسبة وطلب الإذن قبل التصوير"] },
  { section: "تسوّق", title: "اختيار قطعة تحمل قصتها", text: "تنتشر أسواق ومعارض الحرف في مدن متعددة؛ يمنح السؤال عن المادة والصانع والوظيفة الثقافية للقطعة تجربة أعمق.", items: ["اختيار القطع المصنوعة يدويًا", "التعرّف إلى نوع المادة والزخرفة", "دعم الحرفيين والأسواق المحلية", "مراعاة ضوابط نقل المقتنيات الأثرية"] },
];

export const experienceFieldNotes = [
  { title: "أكاكوس", label: "برنامج الصحراء", text: "تجمع الرحلة بين الفن الصخري والوديان والأقواس الطبيعية والسفاري والتخييم؛ وتحتاج إلى تنظيم مسبق ومرشدين محليين." },
  { title: "الجبل الأخضر", label: "غابات وبحر وآثار", text: "تلتقي الغابات والوديان والمرتفعات بالشواطئ، وتربط المسارات شحات وسوسة ورأس الهلال ووادي الكوف." },
  { title: "إيقاع المواسم", label: "فعاليات على مدار العام", text: "تتنوع الأنشطة بين الراليات الشتوية والفروسية والرياضات البحرية الصيفية والاحتفالات الثقافية؛ راجع الجهة المنظمة قبل السفر." },
];

export const practicalDetails = [
  { title: "الدينار الليبي", text: "العملة الوطنية هي الدينار الليبي، ويتكون من 1000 درهم. تحقق من المصارف أو مكاتب الصرف المعتمدة عند الوصول؛ سعر الصرف والخدمات قابلان للتغير." },
  { title: "التسوق المسؤول", text: "فضّل المنتج الحرفي المعروف بمصدره، وتجنب شراء أو نقل أي قطعة قد تكون أثرية أو خاضعة لضوابط الحماية." },
  { title: "الأنشطة والمواسم", text: "تتغير مواعيد التظاهرات والخدمات المتاحة بحسب المدينة والطقس والموسم؛ راجع الجهة المنظمة أو مشغل الرحلة قبل اعتماد الخطة." },
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
