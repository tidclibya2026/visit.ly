import { Activity, ArrowLeft, BellRing, CircleCheck, ClipboardList, FileText, FolderKanban, Languages, RefreshCw, ShieldCheck, TicketCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { AdminVisaInsights } from "@/components/AdminVisaInsights";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const utils = trpc.useUtils();
  const isAdmin = user?.role === "admin";
  const content = trpc.contentAdmin.list.useQuery(undefined, { enabled: isAdmin });
  const visas = trpc.visa.listIntakes.useQuery(undefined, { enabled: isAdmin });
  const notifications = trpc.adminNotifications.list.useQuery(undefined, { enabled: isAdmin, refetchInterval: 15_000 });
  const reviews = trpc.translationReview.list.useQuery(undefined, { enabled: isAdmin });
  const suggestions = trpc.translationReview.suggestions.useQuery(undefined, { enabled: isAdmin });
  const analytics = trpc.translationReview.analytics.useQuery(undefined, { enabled: isAdmin });

  if (loading) return <DashboardLayout><div className="admin-dashboard-loading">جارٍ تجهيز لوحة التحكم…</div></DashboardLayout>;
  if (!user || !isAdmin) return <DashboardLayout><section className="admin-dashboard-denied"><ShieldCheck size={36} /><h1>وصول المشرف مطلوب</h1><p>تظهر شاشة التشغيل الموحدة للمشرفين المعتمدين فقط.</p></section></DashboardLayout>;

  const published = (content.data?.destinations.filter((item) => item.status === "published").length ?? 0) + (content.data?.experiences.filter((item) => item.status === "published").length ?? 0) + (content.data?.sections.filter((item) => item.status === "published").length ?? 0);
  const drafts = (content.data?.destinations.filter((item) => item.status === "draft").length ?? 0) + (content.data?.experiences.filter((item) => item.status === "draft").length ?? 0) + (content.data?.sections.filter((item) => item.status === "draft").length ?? 0);
  const pendingVisa = visas.data?.filter((item) => item.status !== "closed").length ?? 0;
  const unread = notifications.data?.filter((item) => !item.isRead) ?? [];
  const pendingTranslations = suggestions.data?.filter((item) => item.status === "pending").length ?? 0;
  const querySet = [content, visas, notifications, reviews, suggestions, analytics];
  const hasQueryError = querySet.some((query) => query.isError);
  const isSynchronizing = querySet.some((query) => query.isFetching);
  const latestUpdate = Math.max(...querySet.map((query) => query.dataUpdatedAt));
  const dataStatus = hasQueryError ? "تحتاج بعض البيانات إلى إعادة تحميل" : isSynchronizing ? "جارٍ مزامنة بيانات التشغيل" : "البيانات التشغيلية متزامنة";
  const lastUpdate = latestUpdate > 0 ? new Intl.DateTimeFormat("ar-LY", { dateStyle: "medium", timeStyle: "short" }).format(new Date(latestUpdate)) : "بانتظار أول تحديث";
  const priorities = [
    ...(unread.length ? [{ tone: "critical", icon: BellRing, value: unread.length, title: "إشعارات غير مقروءة", description: "راجع تغيّرات حالات الطلبات والملاحظات الجديدة.", href: "/admin/content", action: "فتح الإشعارات" }] : []),
    ...(pendingVisa ? [{ tone: "high", icon: TicketCheck, value: pendingVisa, title: "طلبات تأشيرة مفتوحة", description: "رتّب الطلبات حسب الحالة والتاريخ ثم حدّث المتابعة.", href: "/admin/content", action: "مراجعة الطلبات" }] : []),
    ...(drafts ? [{ tone: "medium", icon: FileText, value: drafts, title: "مسودات محتوى", description: "تحقّق من النص والصورة والمصدر قبل النشر العام.", href: "/admin/content", action: "فتح المسودات" }] : []),
    ...(pendingTranslations ? [{ tone: "medium", icon: Languages, value: pendingTranslations, title: "ترجمات تنتظر قرارًا", description: "اعتمد الترجمة أو أعدها للمراجعة قبل الظهور للزوار.", href: "/admin/translations", action: "فتح المراجعة" }] : []),
  ];
  const refreshOperations = async () => {
    setIsRefreshing(true);
    await Promise.all([
      utils.contentAdmin.list.invalidate(),
      utils.visa.listIntakes.invalidate(),
      utils.adminNotifications.list.invalidate(),
      utils.translationReview.list.invalidate(),
      utils.translationReview.suggestions.invalidate(),
      utils.translationReview.analytics.invalidate(),
    ]);
    setIsRefreshing(false);
  };

  return <DashboardLayout><div className="admin-dashboard">
    <header className="admin-dashboard-hero">
      <div>
        <div className="admin-guide-stamp"><img src="/manus-storage/visitlibya-logo-cropped_4628ce39.png" alt="Visit Libya | زور ليبيا" /><span><b>Visit Libya | زور ليبيا</b><small>منصة الدليل السياحي الرسمي</small></span></div>
        <p className="eyebrow"><ShieldCheck size={14} /> محطة التشغيل 01 · مركز القيادة</p>
        <h1>مركز عمليات المنصة</h1>
        <p>لوحة تنفيذية تجمع المحتوى والطلبات والإشعارات والتقارير في مسار تشغيل واحد واضح وآمن.</p>
        <small className="admin-operator-meta">المشرف الحالي: {user.name || "حساب معتمد"}</small>
      </div>
      <div className="admin-dashboard-tools">
        <div className={`admin-data-status ${hasQueryError ? "has-error" : ""}`} role="status"><Activity size={15} /><span><b>{dataStatus}</b><small>آخر تحديث: {lastUpdate}</small></span></div>
        <div className="admin-dashboard-actions"><button type="button" onClick={refreshOperations} disabled={isRefreshing} aria-label="تحديث بيانات لوحة التحكم"><RefreshCw size={16} className={isRefreshing ? "is-spinning" : ""} /> {isRefreshing ? "جارٍ التحديث" : "تحديث البيانات"}</button><Link href="/admin/content" className="button button-sand">إدارة المحتوى <ArrowLeft size={16} /></Link></div>
      </div>
    </header>

    <section className="admin-stat-grid" aria-label="مؤشرات تشغيلية رئيسية">
      <article><FolderKanban size={20} /><span>المحتوى المنشور</span><strong>{published}</strong><Link href="/discover">عرض الفهرس العام</Link></article>
      <article><FileText size={20} /><span>مسودات تحتاج عملاً</span><strong>{drafts}</strong><Link href="/admin/content">فتح المحتوى</Link></article>
      <article><TicketCheck size={20} /><span>طلبات تأشيرة مفتوحة</span><strong>{pendingVisa}</strong><Link href="/admin/content">مراجعة الطلبات</Link></article>
      <article className={unread.length ? "has-alert" : ""}><BellRing size={20} /><span>إشعارات غير مقروءة</span><strong>{unread.length}</strong><Link href="/admin/content">مركز الإشعارات</Link></article>
    </section>

    <section className="admin-priority-board" aria-labelledby="priority-board-title">
      <header><div><p className="eyebrow"><ClipboardList size={14} /> قائمة العمل</p><h2 id="priority-board-title">أولويات التشغيل الآن</h2><p>ترتيب واضح للعناصر التي تحتاج قرارًا أو متابعة من الفريق.</p></div><div className="admin-priority-header-meta"><span className="admin-station-code">سجل المتابعة · 01</span><span className={`admin-priority-count ${priorities.length ? "has-work" : ""}`}>{priorities.length ? `${priorities.length} عناصر متابعة` : "لا توجد عناصر عاجلة"}</span></div></header>
      {priorities.length ? <div className="admin-priority-list">{priorities.map((item) => <article key={item.title} className={`priority-${item.tone}`}><div className="admin-priority-icon"><item.icon size={19} /></div><div><p><b>{item.value}</b> {item.title}</p><span>{item.description}</span></div><Link href={item.href}>{item.action} <ArrowLeft size={15} /></Link></article>)}</div> : <div className="admin-priority-empty"><CircleCheck size={21} /><div><b>المتابعة الأساسية مكتملة حاليًا.</b><span>ستظهر هنا تلقائيًا أي طلبات أو إشعارات أو مسودات تحتاج تدخلاً.</span></div></div>}
    </section>

    <AdminVisaInsights />

    <section className="admin-dashboard-grid">
      <article className="admin-panel admin-panel-wide"><header><div><p className="eyebrow"><BellRing size={14} /> آخر التنبيهات</p><h2>تحديثات تتطلب متابعة</h2></div><Link href="/admin/content">كل الطلبات <ArrowLeft size={15} /></Link></header>{notifications.data?.length ? <div className="admin-activity-list">{notifications.data.slice(0, 6).map((item) => <div key={item.id} className={item.isRead ? "" : "is-new"}><BellRing size={16} /><span><strong>{item.title}</strong><small>{item.message}</small></span><time>{new Date(item.createdAt).toLocaleString("ar-LY")}</time></div>)}</div> : <p className="admin-empty">لا توجد إشعارات تأشيرة حتى الآن.</p>}</article>
      <article className="admin-panel"><header><div><p className="eyebrow"><Languages size={14} /> جودة اللغات</p><h2>مراجعة الترجمة</h2></div><Link href="/admin/translations">فتح المراجعة <ArrowLeft size={15} /></Link></header><div className="admin-mini-stat"><strong>{pendingTranslations}</strong><span>اقتراحات ترجمة معلقة</span></div><div className="admin-mini-stat"><strong>{reviews.data?.filter((item) => item.status !== "approved").length ?? 0}</strong><span>ترجمات تحتاج قرارًا</span></div></article>
      <article className="admin-panel"><header><div><p className="eyebrow"><TrendingUp size={14} /> تفاعل الزوار</p><h2>آخر 30 يومًا</h2></div></header>{analytics.data?.languages.length ? <ol className="admin-rank-list">{analytics.data.languages.slice(0, 4).map((item) => <li key={item.language}><span>{item.language.toUpperCase()}</span><b>{Number(item.total)}</b></li>)}</ol> : <p className="admin-empty">تبدأ المؤشرات عند تراكم تفاعلات زوار فعلية.</p>}</article>
    </section>

    <section className="admin-quick-actions"><div><p className="eyebrow">إجراءات سريعة</p><h2>ما الذي تريد القيام به الآن؟</h2></div><div><Link href="/admin/content"><FolderKanban size={18} /> إضافة وجهة أو مهرجان</Link><Link href="/admin/content"><TicketCheck size={18} /> تحديث طلب تأشيرة</Link><Link href="/admin/translations"><Languages size={18} /> اعتماد ترجمة</Link><Link href="/discover"><TrendingUp size={18} /> معاينة النشر العام</Link></div></section>
  </div></DashboardLayout>;
}
