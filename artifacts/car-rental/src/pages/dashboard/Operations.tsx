import { useState } from "react";
import {
  Search, SlidersHorizontal, Plus,
  CalendarCheck, UserPlus, Key, Clock, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { Booking } from "@/data/mockData";
import { bookingRequests, rentals, kpis } from "@/data/dashboardData";
import { BookingRequests } from "./BookingRequests";
import { OfflineRentals } from "./OfflineRentals";
import { RentalsManagement } from "./RentalsManagement";

export type OperationsTab = "bookings" | "offline" | "rentals";

interface Props {
  activeTab: OperationsTab;
  onTabChange: (t: OperationsTab) => void;
  bookings: Booking[];
}

const newCount     = bookingRequests.filter(r => r.status === "new").length;
const walkInActive = rentals.filter(r => r.source === "walk-in" && r.status === "active").length;
const confirmedToday = bookingRequests.filter(r => r.status === "confirmed").length;

const OPS_KPIS = [
  { label: "Booking Requests", value: bookingRequests.length, sub: `${newCount} new`, color: "text-primary",     bg: "bg-primary/10",   icon: CalendarCheck  },
  { label: "Walk-in Rentals",  value: walkInActive,           sub: "Active counter",  color: "text-emerald-600", bg: "bg-emerald-50",   icon: UserPlus       },
  { label: "Active Rentals",   value: kpis.activeRentals,     sub: "On the road",     color: "text-sky-600",     bg: "bg-sky-50",       icon: Key            },
  { label: "Pending Actions",  value: newCount,               sub: "Need response",   color: "text-amber-600",   bg: "bg-amber-50",     icon: Clock          },
  { label: "Confirmed",        value: confirmedToday,         sub: "Confirmed total", color: "text-emerald-600", bg: "bg-emerald-50",   icon: CheckCircle2   },
  { label: "Overdue Returns",  value: kpis.overdueRentals,    sub: "Follow up now",   color: "text-red-500",     bg: "bg-red-50",       icon: AlertTriangle  },
];

const TABS = [
  { id: "bookings" as OperationsTab, label: "Booking Requests", icon: CalendarCheck, badge: newCount },
  { id: "offline"  as OperationsTab, label: "Walk-in Rentals",  icon: UserPlus },
  { id: "rentals"  as OperationsTab, label: "Rentals",          icon: Key, badge: kpis.activeRentals },
];

export function OperationsSection({ activeTab, onTabChange }: Props) {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Page header + KPIs + Tabs ── */}
      <div className="px-5 sm:px-7 pt-6 pb-5 space-y-5">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-bold text-[#1a2332]">Operations</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Manage bookings, walk-ins, and rentals in one place</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search clients, cars…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 h-9 w-48 rounded-xl border border-slate-200 bg-white text-[12px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition"
              />
            </div>
            {/* Filter */}
            <button className="h-9 px-3 flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl text-[12px] font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            {/* New walk-in */}
            <button
              onClick={() => { onTabChange("offline"); }}
              className="h-9 px-4 flex items-center gap-1.5 bg-primary text-white rounded-xl text-[12px] font-semibold hover:bg-primary/90 shadow-sm transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              New Walk-in
            </button>
          </div>
        </div>

        {/* KPI mini-cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {OPS_KPIS.map(({ label, value, sub, color, bg, icon: Icon }) => (
            <div key={label} className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
              <div className="flex items-center gap-2 mb-2.5">
                <div className={`w-6 h-6 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-3 w-3 ${color}`} />
                </div>
                <p className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400 leading-tight">{label}</p>
              </div>
              <p className={`text-[22px] font-bold ${color} leading-none tabular-nums`}>{value}</p>
              <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">{sub}</p>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {TABS.map(({ id, label, icon: Icon, badge }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 shadow-sm"
                }`}
              >
                <Icon className="h-[14px] w-[14px] flex-shrink-0" />
                {label}
                {badge !== undefined && badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white/25 text-white" : "bg-primary text-white"}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1">
        {activeTab === "bookings" && <BookingRequests search={search} />}
        {activeTab === "offline"  && <OfflineRentals  search={search} />}
        {activeTab === "rentals"  && <RentalsManagement search={search} />}
      </div>

    </div>
  );
}
