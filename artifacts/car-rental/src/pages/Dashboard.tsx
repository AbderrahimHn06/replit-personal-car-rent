import { useState } from "react";
import { Link } from "wouter";
import {
  LayoutDashboard, CalendarCheck, UserPlus, Key, Car, Users, UserX,
  CalendarDays, Wrench, Bell, BarChart3, Settings, Menu, X,
  ChevronLeft, LogOut,
} from "lucide-react";
import { Booking } from "@/data/mockData";
import { kpis, alerts } from "@/data/dashboardData";
import { Overview } from "./dashboard/Overview";
import { BookingRequests } from "./dashboard/BookingRequests";
import { OfflineRentals } from "./dashboard/OfflineRentals";
import { RentalsManagement } from "./dashboard/RentalsManagement";
import { Fleet } from "./dashboard/Fleet";
import { ClientsSection } from "./dashboard/Clients";
import { BlockedClientsSection } from "./dashboard/BlockedClients";
import { AvailabilitySection } from "./dashboard/Availability";
import { MaintenanceSection } from "./dashboard/MaintenanceSection";
import { AlertsSection } from "./dashboard/AlertsSection";
import { Reports } from "./dashboard/Reports";
import { SettingsSection } from "./dashboard/SettingsSection";

type Section =
  | "overview" | "bookings" | "offline" | "rentals" | "fleet"
  | "clients" | "blocked" | "availability" | "maintenance"
  | "alerts" | "reports" | "settings";

interface NavItem {
  id: Section;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Booking Requests", icon: CalendarCheck, badge: kpis.pendingRequests },
  { id: "offline", label: "Walk-in Rentals", icon: UserPlus },
  { id: "rentals", label: "Rentals", icon: Key },
  { id: "fleet", label: "Fleet", icon: Car },
  { id: "clients", label: "Clients", icon: Users },
  { id: "blocked", label: "Blocked Clients", icon: UserX },
  { id: "availability", label: "Availability", icon: CalendarDays },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "alerts", label: "Alerts", icon: Bell, badge: alerts.filter(a => a.severity === "high").length },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const LABELS: Record<Section, string> = {
  overview: "Overview", bookings: "Booking Requests", offline: "Walk-in Rentals",
  rentals: "Rentals", fleet: "Fleet Management", clients: "Clients",
  blocked: "Blocked Clients", availability: "Availability", maintenance: "Maintenance",
  alerts: "Alerts", reports: "Reports", settings: "Settings",
};

export function Dashboard({ bookings }: { bookings: Booking[] }) {
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (s: Section) => {
    setSection(s);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col w-60 bg-white border-r border-slate-200 shadow-sm transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Car className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-primary text-sm tracking-tight">EliteRide</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV.map(({ id, label, icon: Icon, badge }) => {
            const active = section === id;
            return (
              <button
                key={id}
                onClick={() => navigate(id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mb-0.5 transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1 text-left truncate">{label}</span>
                {badge !== undefined && badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      active ? "bg-white/25 text-white" : "bg-primary text-white"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-3 space-y-1">
          <Link href="/">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Website</span>
            </button>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">AG</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">Agency Manager</p>
              <p className="text-[10px] text-slate-400 truncate">admin@eliteride.dz</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="text-sm font-bold text-slate-800">{LABELS[section]}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
              onClick={() => navigate("alerts")}
            >
              <Bell className="h-4 w-4" />
              {alerts.filter(a => a.severity === "high").length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">AG</span>
            </div>
          </div>
        </header>

        {/* Section content */}
        <main className="flex-1 overflow-y-auto">
          {section === "overview" && <Overview bookings={bookings} onNavigate={navigate} />}
          {section === "bookings" && <BookingRequests bookings={bookings} />}
          {section === "offline" && <OfflineRentals />}
          {section === "rentals" && <RentalsManagement />}
          {section === "fleet" && <Fleet />}
          {section === "clients" && <ClientsSection />}
          {section === "blocked" && <BlockedClientsSection />}
          {section === "availability" && <AvailabilitySection />}
          {section === "maintenance" && <MaintenanceSection />}
          {section === "alerts" && <AlertsSection />}
          {section === "reports" && <Reports />}
          {section === "settings" && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}
