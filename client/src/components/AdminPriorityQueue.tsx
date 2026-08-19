import { ArrowLeft, Filter, Search, TicketCheck, UserRoundCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const statusLabels: Record<string, string> = { received: "تم الاستلام", under_review: "قيد المراجعة", awaiting_information: "بانتظار معلومات", ready_for_official_referral: "جاهز للإحالة", closed: "مغلق" };
const isUrgent = (status: string, assignee: string | null) => !assignee || status === "received" || status === "awaiting_information";

export function AdminPriorityQueue() {
  const utils = trpc.useUtils();
  const visas = trpc.visa.listIntakes.useQuery();
  const staff = trpc.visa.assignableStaff.useQuery();
  const assign = trpc.visa.assignIntake.useMutation({ onSuccess: () => { utils.visa.listIntakes.invalidate(); utils.visa.history.invalidate(); utils.adminNotifications.list.invalidate(); } });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [assignment, setAssignment] = useState("all");
  const [urgency, setUrgency] = useState("all");
  const [sort, setSort] = useState("urgency");
  const staffByOpenId = useMemo(() => new Map((staff.data ?? []).map((member) => [member.openId, member.name])), [staff.data]);
  const rows = useMemo(() => (visas.data ?? []).filter((item) => {
    const haystack = `${item.referenceCode} ${item.residenceCountry} ${item.intendedRegion ?? ""} ${item.assignedToOpenId ?? ""} ${staffByOpenId.get(item.assignedToOpenId ?? "") ?? ""}`.toLocaleLowerCase("ar");
    const assigned = Boolean(item.assignedToOpenId);
    return item.status !== "closed" && (!search || haystack.includes(search.toLocaleLowerCase("ar"))) && (status === "all" || item.status === status) && (assignment === "all" || assignment === "assigned" && assigned || assignment === "unassigned" && !assigned) && (urgency === "all" || urgency === "urgent" && isUrgent(item.status, item.assignedToOpenId) || urgency === "normal" && !isUrgent(item.status, item.assignedToOpenId));
  }).sort((a, b) => sort === "oldest" ? a.createdAt.getTime() - b.createdAt.getTime() : sort === "latest" ? b.createdAt.getTime() - a.createdAt.getTime() : Number(isUrgent(b.status, b.assignedToOpenId)) - Number(isUrgent(a.status, a.assignedToOpenId)) || b.createdAt.getTime() - a.createdAt.getTime()), [visas.data, search, status, assignment, urgency, sort, staffByOpenId]);

  return <section className="admin-priority-queue" aria-labelledby="priority-queue-title">
    <header><div><p className="eyebrow"><TicketCheck size={14} /> متابعة الفريق</p><h2 id="priority-queue-title">قائمة الأولويات التفصيلية</h2><p>ابحث برقم الطلب أو المنطقة أو المسؤول، ثم عيّن المتابعة من القائمة نفسها.</p></div><span className="admin-station-code">سجل التوزيع · 04</span></header>
    <div className="priority-queue-filters"><label className="priority-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث بالمرجع أو المنطقة أو المسؤول" aria-label="بحث سريع في طلبات التأشيرة" /></label><label><span><Filter size={13} /> الحالة</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">كل الحالات</option>{Object.entries(statusLabels).filter(([value]) => value !== "closed").map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label><span>التعيين</span><select value={assignment} onChange={(event) => setAssignment(event.target.value)}><option value="all">الكل</option><option value="unassigned">غير معيّن</option><option value="assigned">معيّن</option></select></label><label><span>الأولوية</span><select value={urgency} onChange={(event) => setUrgency(event.target.value)}><option value="all">كل الأولويات</option><option value="urgent">تحتاج تدخلاً</option><option value="normal">متابعة عادية</option></select></label><label><span>الترتيب</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="urgency">الأولوية أولًا</option><option value="latest">الأحدث أولًا</option><option value="oldest">الأقدم أولًا</option></select></label></div>
    <div className="priority-queue-result"><span>{rows.length} طلبًا مطابقًا</span><span>الطلبات غير المعيّنة أو الجديدة تظهر كأولوية متابعة.</span></div>
    {rows.length ? <div className="priority-queue-list">{rows.slice(0, 20).map((item) => <article key={item.id} className={isUrgent(item.status, item.assignedToOpenId) ? "is-urgent" : ""}><div className="priority-queue-ref"><b>{item.referenceCode}</b><span>{statusLabels[item.status]}</span></div><div className="priority-queue-meta"><span>{item.intendedRegion || "منطقة غير محددة"}</span><small>{new Date(item.createdAt).toLocaleDateString("ar-LY")}</small></div><label className="priority-assignee"><UserRoundCheck size={15} /><select value={item.assignedToOpenId ?? ""} onChange={(event) => assign.mutate({ id: item.id, assigneeOpenId: event.target.value || null })} disabled={assign.isPending} aria-label={`تعيين مسؤول للطلب ${item.referenceCode}`}><option value="">غير معيّن</option>{staff.data?.map((member) => <option key={member.openId} value={member.openId}>{member.name}</option>)}</select></label><Link href="/admin/content">فتح السجل <ArrowLeft size={14} /></Link></article>)}</div> : <p className="priority-queue-empty">لا توجد طلبات مفتوحة تطابق معايير البحث والتصفية الحالية.</p>}
  </section>;
}
