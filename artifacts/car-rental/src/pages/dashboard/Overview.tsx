import { motion } from "framer-motion";
import {
  CalendarCheck, Clock, CheckCircle2, Key, Car, Wrench,
  Users, UserX, AlertTriangle, TrendingUp, RefreshCw,
  ArrowRight, Activity, BarChart3, CalendarDays,
  ChevronUp, ChevronDown, UserPlus, Bell,
} from "lucide-react";
import { Booking } from "@/data/mockData";
import { kpis, recentActivity, alerts, fleet } from "@/data/dashboardData";

type NavTarget = string;

interface Props {
  bookings: Booking[];
  onNavigate: (s: NavTarget) => void;
}

/* ─── KPI card definition ─── */
interface KpiDef {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  sub: string;
  trend?: "up" | "down" | "neutral" | "warn";
  section?: NavTarget;
}

const kpiCards = (k: typeof kpis): KpiDef[] => [
  {
    label: "Total Bookings",
    value: k.totalBookings,
    icon: CalendarCheck,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    sub: "All time reservations",
    trend: "neutral",
    section: "operations",
  },
  {
    label: "Pending Requests",
    value: k.pendingRequests,
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    sub: "Awaiting confirmation",
    trend: k.pendingRequests > 3 ? "warn" : "neutral",
    section: "operations",
  },
  {
    label: "Confirmed",
    value: k.confirmedBookings,
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    sub: "Confirmed this month",
    trend: "up",
    section: "operations",
  },
  {
    label: "Active Rentals",
    value: k.activeRentals,
    icon: Key,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    sub: "Currently on the road",
    trend: "neutral",
    section: "rentals",
  },
  {
    label: "Available Cars",
    value: k.availableCars,
    icon: Car,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    sub: `of ${fleet.length} total vehicles`,
    trend: "neutral",
    section: "fleet",
  },
  {
    label: "Rented Cars",
    value: k.rentedCars,
    icon: Key,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    sub: "Currently rented out",
    trend: "neutral",
    section: "fleet",
  },
  {
    label: "In Maintenance",
    value: k.maintenanceCars,
    icon: Wrench,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    sub: "Temporarily off-road",
    trend: k.maintenanceCars > 1 ? "warn" : "neutral",
    section: "maintenance",
  },
  {
    label: "Total Clients",
    value: k.totalClients,
    icon: Users,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    sub: "Registered accounts",
    trend: "up",
    section: "clients",
  },
  {
    label: "Blocked Clients",
    value: k.blockedClients,
    icon: UserX,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    sub: "Restricted from renting",
    trend: k.blockedClients > 2 ? "warn" : "neutral",
    section: "blocked",
  },
];

function TrendIcon({ trend }: { trend?: KpiDef["trend"] }) {
  if (trend === "up") return <ChevronUp className="h-3 w-3 text-emerald-500 inline mr-0.5" />;
  if (trend === "down") return <ChevronDown className="h-3 w-3 text-red-400 inline mr-0.5" />;
  return null;
}

function trendTextColor(trend?: KpiDef["trend"]) {
  if (trend === "up") return "text-emerald-600";
  if (trend === "down") return "text-red-500";
  if (trend === "warn") return "text-amber-600";
  return "text-slate-400";
}

/* ─── KPI Card ─── */
function KpiCard({ def, index, onNavigate }: { def: KpiDef; index: number; onNavigate: (s: string) => void }) {
  const { label, value, icon: Icon, iconBg, iconColor, sub, trend, section } = def;
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => section && onNavigate(section)}
      className="group w-full text-left bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
    >
      {/* Top row: label + icon */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg} group-hover:scale-110 transition-transform`}>
          <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        </div>
      </div>
      {/* Big value */}
      <p className="text-[32px] font-bold text-[#1a2332] leading-none tabular-nums">{value}</p>
      {/* Metadata */}
      <p className={`text-[11px] font-medium mt-2.5 flex items-center ${trendTextColor(trend)}`}>
        <TrendIcon trend={trend} />{sub}
      </p>
    </motion.button>
  );
}

/* ─── Alert severity config ─── */
const SEVERITY: Record<string, { bg: string; border: string; badge: string; badgeText: string; icon: string }> = {
  high:   { bg: "bg-red-50",    border: "border-red-100",    badge: "bg-red-100",    badgeText: "text-red-700",  icon: "🔴" },
  medium: { bg: "bg-amber-50",  border: "border-amber-100",  badge: "bg-amber-100",  badgeText: "text-amber-700", icon: "🟡" },
  low:    { bg: "bg-blue-50",   border: "border-blue-100",   badge: "bg-blue-100",   badgeText: "text-blue-700", icon: "🔵" },
};

/* ─── Fleet progress bar row ─── */
function FleetRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] font-medium text-slate-600">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-slate-800">{count}</span>
          <span className="text-[10px] text-slate-400 w-7 text-right">{pct}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ─── Quick nav shortcut tiles ─── */
const SHORTCUTS = [
  { label: "Booking Requests", icon: CalendarCheck, section: "operations", badge: (k: typeof kpis) => k.pendingRequests },
  { label: "Walk-in Rentals",  icon: UserPlus,      section: "offline",    badge: () => 0 },
  { label: "Rentals",          icon: Key,           section: "rentals",    badge: (k: typeof kpis) => k.activeRentals },
  { label: "Fleet",            icon: Car,           section: "fleet",      badge: () => 0 },
  { label: "Availability",     icon: CalendarDays,  section: "availability", badge: () => 0 },
  { label: "Alerts",           icon: Bell,          section: "alerts",     badge: (k: typeof kpis) => alerts.filter(a => a.severity === "high").length },
];

/* ─── Overview component ─── */
export function Overview({ bookings, onNavigate }: Props) {
  const cards = kpiCards(kpis);
  const urgentAlerts = alerts.filter(a => a.severity === "high");
  const totalFleet = fleet.length;
  const utilization = Math.round(((kpis.rentedCars + kpis.reservedCars) / totalFleet) * 100);
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="p-5 sm:p-7 space-y-8 max-w-[1440px]">

      {/* ── 1. Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a2332] leading-tight">Overview</h1>
          <p className="text-[12px] text-slate-400 mt-1">Daily operations snapshot</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
            📅 {today}
          </span>
          <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 shadow-sm transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onNavigate("reports")}
            className="flex items-center gap-1.5 h-8 px-3 bg-white border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
          >
            View reports <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* ── 2. KPI grid (9 cards, 3 per row on XL) ── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Key Metrics</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((def, i) => (
            <KpiCard key={def.label} def={def} index={i} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* ── 3. Main content row: Activity + Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Recent Activity (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-800 leading-tight">Recent Activity</p>
                <p className="text-[10px] text-slate-400">Operations log</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivity.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.03 }}
                className="flex items-start gap-4 px-5 py-3.5 hover:bg-slate-50/70 transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-xl flex-shrink-0 text-sm border border-slate-100">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-slate-700 truncate leading-tight">{item.title}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5 whitespace-nowrap">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Urgent Alerts (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-800 leading-tight">Urgent Alerts</p>
                <p className="text-[10px] text-slate-400">{urgentAlerts.length} requiring attention</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("alerts")}
              className="text-[11px] text-primary font-semibold hover:underline flex items-center gap-1"
            >
              All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {urgentAlerts.map((a) => {
              const sev = SEVERITY[a.severity] ?? SEVERITY.low;
              return (
                <div key={a.id} className={`rounded-xl border p-3.5 ${sev.bg} ${sev.border}`}>
                  <div className="flex items-start gap-2.5">
                    <span className="text-sm flex-shrink-0">{sev.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-slate-800 leading-tight">{a.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{a.message}</p>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-[10px] text-slate-400">{a.time}</span>
                        <button
                          onClick={() => onNavigate("alerts")}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${sev.badge} ${sev.badgeText} hover:opacity-80 transition-opacity`}
                        >
                          Review →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {urgentAlerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <CheckCircle2 className="h-8 w-8 mb-2 text-emerald-400" />
                <p className="text-[12px] font-medium">No urgent alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. Fleet status summary (full width) ── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Car className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800 leading-tight">Fleet Status</p>
              <p className="text-[10px] text-slate-400">
                {totalFleet} vehicles — {utilization}% utilization
              </p>
            </div>
          </div>
          <button onClick={() => onNavigate("fleet")} className="text-[11px] text-primary font-semibold hover:underline flex items-center gap-1">
            Manage fleet <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-5">
          {[
            { label: "Available",    count: kpis.availableCars,    color: "bg-emerald-500" },
            { label: "Rented",       count: kpis.rentedCars,       color: "bg-amber-400" },
            { label: "Reserved",     count: kpis.reservedCars,     color: "bg-indigo-500" },
            { label: "Maintenance",  count: kpis.maintenanceCars,  color: "bg-red-400" },
          ].map(({ label, count, color }) => (
            <FleetRow key={label} label={label} count={count} total={totalFleet} color={color} />
          ))}
        </div>
        {/* Combined bar */}
        <div className="px-6 pb-5">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex gap-px">
            {[
              { count: kpis.availableCars,   color: "bg-emerald-500" },
              { count: kpis.rentedCars,       color: "bg-amber-400" },
              { count: kpis.reservedCars,     color: "bg-indigo-500" },
              { count: kpis.maintenanceCars,  color: "bg-red-400" },
            ].map(({ count, color }) => (
              <div
                key={color}
                className={`h-full ${color} transition-all`}
                style={{ width: `${(count / totalFleet) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-2.5 flex-wrap">
            {[
              { label: "Available",   color: "bg-emerald-500" },
              { label: "Rented",      color: "bg-amber-400" },
              { label: "Reserved",    color: "bg-indigo-500" },
              { label: "Maintenance", color: "bg-red-400" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-sm ${color}`} />
                <span className="text-[10px] text-slate-400 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. Quick navigation shortcuts ── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Quick Access</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SHORTCUTS.map(({ label, icon: Icon, section, badge }) => {
            const badgeCount = badge(kpis);
            return (
              <button
                key={section}
                onClick={() => onNavigate(section)}
                className="group flex flex-col items-center gap-2.5 p-4 bg-white border border-slate-200/80 rounded-2xl hover:border-primary/30 hover:shadow-md hover:bg-primary/2 transition-all text-center"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Icon className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                  </div>
                  {badgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {badgeCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-600 group-hover:text-primary transition-colors leading-tight">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 6. Optional compact report blocks ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Bookings by source */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-primary" />
            <p className="text-[12px] font-bold text-slate-700">Bookings by Source</p>
          </div>
          <div className="space-y-3">
            {[
              { label: "Website",   count: 16, color: "bg-primary" },
              { label: "Walk-in",   count: 5,  color: "bg-amber-400" },
              { label: "Phone",     count: 2,  color: "bg-indigo-400" },
            ].map(({ label, count, color }) => {
              const pct = Math.round((count / 23) * 100);
              return (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-slate-500">{label}</span>
                    <span className="text-[11px] font-bold text-slate-700">{count} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue snapshot */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <p className="text-[12px] font-bold text-slate-700">Revenue Snapshot</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">This Month</p>
                <p className="text-2xl font-bold text-[#1a2332]">${kpis.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Last Month</p>
                <p className="text-[15px] font-semibold text-slate-500">${kpis.lastMonthRevenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (kpis.monthlyRevenue / (kpis.lastMonthRevenue * 1.3)) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold">
              ↑ +{Math.round(((kpis.monthlyRevenue - kpis.lastMonthRevenue) / kpis.lastMonthRevenue) * 100)}% compared to last month
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
