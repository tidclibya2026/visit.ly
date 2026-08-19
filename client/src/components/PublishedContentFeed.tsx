import { CalendarDays, Landmark, MapPin, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

type FeedKind = "destinations" | "experiences" | "sections";
const meta = {
  destinations: { kicker: "محتوى منشور من الإدارة", title: "وجهات تُضاف إلى الدليل مباشرة.", icon: Landmark, href: "/destinations" },
  experiences: { kicker: "تجارب منشورة حديثًا", title: "أنشطة جديدة في مسار الزائر.", icon: Sparkles, href: "/experiences" },
  sections: { kicker: "مهرجانات وأقسام منشورة", title: "ما يُستجد في الرزنامة الثقافية.", icon: CalendarDays, href: "/events" },
} as const;

export function PublishedContentFeed({ kind }: { kind: FeedKind }) {
  const { data } = trpc.publishedContent.list.useQuery();
  const definition = meta[kind];
  const items = kind === "destinations" ? (data?.destinations ?? []).map((item) => ({ id: item.id, title: item.title, imageUrl: item.imageUrl, meta: `${item.city} · ${item.region}`, text: item.description })) : kind === "experiences" ? (data?.experiences ?? []).map((item) => ({ id: item.id, title: item.title, imageUrl: item.imageUrl, meta: `${item.region}${item.season ? ` · ${item.season}` : ""}`, text: item.description })) : (data?.sections ?? []).map((item) => ({ id: item.id, title: item.title, imageUrl: item.imageUrl, meta: item.sectionType === "festival" ? "مهرجان" : "قسم منشور", text: item.summary }));
  if (!items.length) return null;
  const Icon = definition.icon;
  return <section className="page-frame published-content-feed"><div className="published-content-head"><div><p className="eyebrow"><Icon size={14} /> {definition.kicker}</p><h2>{definition.title}</h2></div><Link href={definition.href}>عرض الكل</Link></div><div className="published-content-grid">{items.map((item) => <article key={item.id}>{item.imageUrl && <img src={item.imageUrl} alt={item.title} loading="lazy" />}<div><p><MapPin size={13} /> {item.meta}</p><h3>{item.title}</h3><span>{item.text}</span></div></article>)}</div></section>;
}
