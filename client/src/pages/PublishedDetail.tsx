import { ArrowLeft, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { Link, useRoute } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { trpc } from "@/lib/trpc";

const labels = { destinations: "وجهة منشورة", experiences: "تجربة منشورة", sections: "مهرجان أو قسم منشور" } as const;
export default function PublishedDetail() {
  const [, params] = useRoute("/published/:kind/:slug");
  const kind = params?.kind === "destinations" || params?.kind === "experiences" || params?.kind === "sections" ? params.kind : null;
  const detail = trpc.publishedContent.detail.useQuery({ kind: kind ?? "destinations", slug: params?.slug ?? "missing" }, { enabled: Boolean(kind && params?.slug) });
  if (!kind || detail.isError) return <SiteShell><section className="page-frame public-detail-empty"><h1>هذا المحتوى غير متاح.</h1><Link href="/discover" className="button button-ink">استكشف المحتوى المنشور</Link></section></SiteShell>;
  if (!detail.data) return <SiteShell><section className="page-frame public-detail-empty"><p>جارٍ تحميل التفاصيل المنشورة…</p></section></SiteShell>;
  const item = detail.data;
  const isDestination = "city" in item;
  const isExperience = "season" in item;
  const isSection = "summary" in item;
  const location = isDestination ? `${item.city} · ${item.region}` : isExperience ? `${item.region}${item.season ? ` · ${item.season}` : ""}` : isSection && item.sectionType === "festival" ? "مهرجان منشور" : "قسم منشور";
  const description = isSection ? item.summary : item.description;
  const categoryLabel = isDestination ? item.category === "heritage" ? "تراث" : item.category === "nature" ? "طبيعة" : item.category === "coast" ? "ساحل" : "مدينة" : null;
  return <SiteShell><section className="public-detail-hero">{item.imageUrl && <img src={item.imageUrl} alt={item.title} />}<div className="public-detail-ink" /><div className="page-frame"><p className="eyebrow light"><Sparkles size={14} /> {labels[kind]}</p><h1>{item.title}</h1><p><MapPin size={16} /> {location}</p></div></section><section className="page-frame public-detail-body"><article><p className="eyebrow">تفاصيل منشورة</p><h2>{item.title}</h2><p>{description}</p>{isExperience && <div className="public-detail-meta"><CalendarDays size={18} /><span>الموسم المقترح: {item.season || "يُحدد عند النشر"}</span></div>}{categoryLabel && <div className="public-detail-meta"><MapPin size={18} /><span>الفئة: {categoryLabel}</span></div>}</article><aside><p>حالة المحتوى</p><strong>منشور ومتاح للزوار</strong><span>آخر تحديث: {new Date(item.updatedAt).toLocaleDateString("ar-LY")}</span><Link href="/discover">بحث متقدم <ArrowLeft size={15} /></Link></aside></section></SiteShell>;
}
