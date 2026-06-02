import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  LayoutDashboard, CalendarCheck, UserPlus, Key, Car, Users, UserX,
  CalendarDays, Wrench, Bell, BarChart3, Settings, Menu, X, ChevronLeft,
  AlertTriangle, CalendarCheck2, Clock, ShieldOff, Bike, CheckCircle2,
} from "lucide-react";
import { GlobalSearch } from "./dashboard/GlobalSearch";
import { Booking } from "@/data/mockData";
import { kpis, alerts } from "@/data/dashboardData";
import { Overview } from "./dashboard/Overview";
import { OperationsSection, OperationsTab } from "./dashboard/Operations";
import { Fleet } from "./dashboard/Fleet";
import { ClientsSection } from "./dashboard/Clients";
import { BlockedClientsSection } from "./dashboard/BlockedClients";
import { AvailabilitySection } from "./dashboard/Availability";
import { MaintenanceSection } from "./dashboard/MaintenanceSection";
import { AlertsSection } from "./dashboard/AlertsSection";
import { Reports } from "./dashboard/Reports";
import { SettingsSection } from "./dashboard/SettingsSection";
import {
  useNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  AppNotification,
} from "@/data/localStore";

type Section =
  | "overview" | "operations" | "fleet" | "clients"
  | "blocked" | "availability" | "maintenance"
  | "alerts" | "reports" | "settings";

interface NavGroup {
  label?: string;
  items: {
    id: Section;
    label: string;
    icon: React.ElementType;
    badge?: number;
    opsTab?: OperationsTab;
  }[];
}

const urgentCount = alerts.filter(a => a.severity === "high").length;

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
    ],
  },
  {
    label: "Rentals",
    items: [
      { id: "operations", label: "Rentals", icon: Key, badge: kpis.pendingRequests },
    ],
  },
  {
    label: "Fleet",
    items: [
      { id: "fleet",        label: "Fleet",        icon: Car },
      { id: "availability", label: "Availability", icon: CalendarDays },
      { id: "maintenance",  label: "Maintenance",  icon: Wrench },
    ],
  },
  {
    label: "Clients",
    items: [
      { id: "clients", label: "Clients",         icon: Users },
      { id: "blocked", label: "Blocked Clients", icon: UserX },
    ],
  },
  {
    label: "Insights",
    items: [
      { id: "alerts",  label: "Alerts",   icon: Bell,      badge: urgentCount },
      { id: "reports", label: "Reports",  icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

const LABELS: Record<Section, { title: string; sub: string }> = {
  overview:     { title: "Overview",         sub: "Today's summary and key metrics" },
  operations:   { title: "Rentals",           sub: "Bookings, walk-ins, and rental lifecycle in one workspace" },
  fleet:        { title: "Fleet",            sub: "Vehicle inventory and status" },
  clients:      { title: "Clients",          sub: "Registered client profiles" },
  blocked:      { title: "Blocked Clients",  sub: "Clients restricted from renting" },
  availability: { title: "Availability",     sub: "Weekly vehicle schedule" },
  maintenance:  { title: "Maintenance",      sub: "Service queue and scheduling" },
  alerts:       { title: "Alerts",           sub: "Operational alerts requiring attention" },
  reports:      { title: "Reports",          sub: "Business performance summary" },
  settings:     { title: "Settings",         sub: "Agency configuration" },
};

/* ── Notifications Icon Helper ── */
function NotifIcon({ type }: { type: AppNotification["type"] }) {
  const cfgs: Record<AppNotification["type"], { bg: string; text: string; Icon: React.ElementType }> = {
    rental:      { bg: "bg-emerald-50",  text: "text-emerald-600", Icon: Car           },
    booking:     { bg: "bg-indigo-50",   text: "text-indigo-600",  Icon: CalendarCheck2 },
    alert:       { bg: "bg-red-50",      text: "text-red-600",     Icon: AlertTriangle  },
    client:      { bg: "bg-amber-50",    text: "text-amber-600",   Icon: UserPlus       },
    maintenance: { bg: "bg-blue-50",     text: "text-blue-600",    Icon: Wrench         },
  };
  const { bg, text, Icon } = cfgs[type];
  return (
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
      <Icon className={`h-3.5 w-3.5 ${text}`} />
    </div>
  );
}

/* ── Notifications Modal ── */
function NotificationsModal({
  onClose,
  onNavigateAlerts,
}: {
  onClose: () => void;
  onNavigateAlerts: () => void;
}) {
  const notifications = useNotifications();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="fixed inset-0 z-[45]" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.17, ease: "easeOut" }}
        className="absolute right-0 top-12 z-[46] w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-slate-500" />
            <p className="text-[13.5px] font-bold text-[#1a2332]">Notifications</p>
            {unread > 0 && (
              <span className="bg-red-500 text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>
            )}
          </div>
          {unread > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-[11.5px] font-semibold text-violet-600 hover:text-violet-700 transition-colors cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[380px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="h-7 w-7 text-slate-200 mx-auto mb-2.5" />
              <p className="text-[12.5px] font-semibold text-slate-400">No notifications</p>
              <p className="text-[11.5px] text-slate-300 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.type === "alert" || n.type === "maintenance") {
                      onNavigateAlerts();
                    }
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer ${!n.read ? "bg-violet-50/40" : ""}`}
                >
                  <NotifIcon type={n.type} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12.5px] font-semibold leading-tight ${!n.read ? "text-slate-900" : "text-slate-700"}`}>
                      {n.title}
                    </p>
                    <p className="text-[11.5px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                    <p className="text-[10.5px] text-slate-400 mt-1">{n.time}</p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/60">
          <button
            onClick={() => { onNavigateAlerts(); onClose(); }}
            className="w-full text-center text-[12px] font-semibold text-violet-600 hover:text-violet-700 transition-colors cursor-pointer"
          >
            View all alerts →
          </button>
        </div>
      </motion.div>
    </>
  );
}

export function Dashboard({ bookings }: { bookings: Booking[] }) {
  const [section, setSection]             = useState<Section>("overview");
  const [opsTab, setOpsTab]               = useState<OperationsTab>("bookings");
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [showNotifications, setShowNotif] = useState(false);

  const notifications = useNotifications();
  const unreadCount   = notifications.filter(n => !n.read).length;

  const navigate = (s: string, opsTabOverride?: OperationsTab) => {
    const OPS_TAB_MAP: Record<string, OperationsTab> = {
      bookings: "bookings",
      offline:  "offline",
      rentals:  "rentals",
    };
    if (OPS_TAB_MAP[s]) {
      setSection("operations");
      setOpsTab(OPS_TAB_MAP[s]);
    } else {
      setSection(s as Section);
      if (opsTabOverride) setOpsTab(opsTabOverride);
    }
    setSidebarOpen(false);
  };

  const { title, sub } = LABELS[section];

  return (
    <div className="flex h-screen bg-[#F5F6F8] overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col w-[220px] bg-white border-r border-slate-200/80 shadow-sm transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-[60px] px-5 border-b border-slate-100 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <Car className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-[#1a2332] text-sm tracking-tight">EliteRide</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <p className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-1.5">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map(({ id, label, icon: Icon, badge, opsTab: tabTarget }, ii) => {
                  const active =
                    section === id &&
                    (!tabTarget || opsTab === tabTarget);

                  return (
                    <button
                      key={`${id}-${ii}`}
                      onClick={() => navigate(id, tabTarget)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-medium transition-all cursor-pointer ${
                        active
                          ? "bg-primary text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="h-[14px] w-[14px] flex-shrink-0" />
                      <span className="flex-1 text-left truncate">{label}</span>
                      {badge !== undefined && badge > 0 && (
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${
                            active ? "bg-white/25 text-white" : "bg-primary text-white"
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 p-3 space-y-1 flex-shrink-0">
          <Link href="/">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Website</span>
            </button>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-primary/12 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-primary">AG</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] font-semibold text-slate-700 truncate">Agency Manager</p>
              <p className="text-[10px] text-slate-400 truncate">admin@eliteride.dz</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-[60px] bg-white border-b border-slate-200/80 flex items-center justify-between px-5 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-[13px] font-bold text-[#1a2332] leading-tight">{title}</h1>
              <p className="text-[10.5px] text-slate-400 leading-tight hidden sm:block">{sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <GlobalSearch onNavigate={navigate} />

            {/* Bell / Notifications */}
            <div className="relative">
              <button
                className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                onClick={() => setShowNotif(p => !p)}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <NotificationsModal
                    onClose={() => setShowNotif(false)}
                    onNavigateAlerts={() => navigate("alerts")}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="w-7 h-7 rounded-full bg-primary/12 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">AG</span>
            </div>
          </div>
        </header>

        {/* Section content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="min-h-full"
            >
              {section === "overview"     && <Overview bookings={bookings} onNavigate={navigate} />}
              {section === "operations"   && (
                <OperationsSection
                  activeTab={opsTab}
                  onTabChange={setOpsTab}
                />
              )}
              {section === "fleet"        && <Fleet />}
              {section === "clients"      && <ClientsSection />}
              {section === "blocked"      && <BlockedClientsSection />}
              {section === "availability" && <AvailabilitySection />}
              {section === "maintenance"  && <MaintenanceSection />}
              {section === "alerts"       && <AlertsSection />}
              {section === "reports"      && <Reports />}
              {section === "settings"     && <SettingsSection />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
