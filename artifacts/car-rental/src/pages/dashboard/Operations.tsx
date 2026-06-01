import { useState } from "react";
import {
  Search, SlidersHorizontal, Plus,
  CalendarCheck, UserPlus, Key, Clock, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { bookingRequests, rentals, kpis } from "@/data/dashboardData";
import { BookingRequests } from "./BookingRequests";
import { OfflineRentals } from "./OfflineRentals";
import { RentalsManagement } from "./RentalsManagement";

export type OperationsTab = "bookings" | "offline" | "rentals";

interface Props {
  activeTab: OperationsTab;
  onTabChange: (t: OperationsTab) => void;
}

const newCount       = bookingRequests.filter(r => r.status === "new").length;
const walkInActive   = rentals.filter(r => r.source === "walk-in" && (r.status === "active" || r.status === "overdue")).length;
const confirmedToday = bookingRequests.filter(r => r.status === "confirmed").length;

const OPS_KPIS = [
  { label: "Booking Requests", value: bookingRequests.length, sub: `${newCount} new`, color: "text-violet-600",  bg: "bg-violet-50",  icon: CalendarCheck  },
  { label: "Walk-in Rentals",  value: walkInActive,           sub: "Active counter", color: "text-emerald-600", bg: "bg-emerald-50", icon: UserPlus       },
  { label: "Active Rentals",   value: kpis.activeRentals,     sub: "On the road",    color: "text-sky-600",     bg: "bg-sky-50",     icon: Key            },
  { label: "Pending Actions",  value: newCount,               sub: "Need response",  color: "text-amber-600",   bg: "bg-amber-50",   icon: Clock          },
  { label: "Confirmed Today",  value: confirmedToday,         sub: "Confirmed",      color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2   },
  { label: "Overdue Returns",  value: kpis.overdueRentals,    sub: "Follow up now",  color: "text-red-500",     bg: "bg-red-50",     icon: AlertTriangle  },
];

const TABS = [
  { id: "bookings" as OperationsTab, label: "Booking Requests", icon: CalendarCheck, badge: newCount },
  { id: "offline"  as OperationsTab, label: "Walk-in Rentals",  icon: UserPlus },
  { id: "rentals"  as OperationsTab, label: "Rentals",          icon: Key, badge: kpis.activeRentals },
];

export function OperationsSection({ activeTab, onTabChange }: Props) {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fb]">

      {/* ── Page header ── */}
      <div className="px-6 sm:px-8 pt-7 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] font-bold text-[#1a2332] tracking-tight">Rentals</h2>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">Bookings, walk-ins, and rental lifecycle in one workspace</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search clients, cars…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 h-10 w-52 rounded-xl border border-slate-200 bg-white text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 shadow-sm transition"
              />
            </div>
            <button className="h-10 px-3.5 flex items-center gap-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button
              onClick={() => { onTabChange("offline"); }}
              className="h-10 px-5 flex items-center gap-2 bg-[#1a2332] text-white rounded-xl text-[13px] font-semibold hover:bg-[#243044] shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Walk-in
            </button>
          </div>
        </div>

        {/* KPI mini-cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {OPS_KPIS.map(({ label, value, sub, color, bg, icon: Icon }) => (
            <div key={label} className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className={`text-[26px] font-bold ${color} leading-none tabular-nums mb-1`}>{value}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 leading-tight mb-1">{label}</p>
              <p className="text-[11px] text-slate-400">{sub}</p>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 flex-wrap pb-0">
          {TABS.map(({ id, label, icon: Icon, badge }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                  active
                    ? "bg-[#1a2332] text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 shadow-sm"
                }`}
              >
                <Icon className="h-[15px] w-[15px] flex-shrink-0" />
                {label}
                {badge !== undefined && badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                    active ? "bg-white/20 text-white" : "bg-violet-600 text-white"
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 sm:mx-8 mt-4 border-t border-slate-200" />

      {/* ── Tab content ── */}
      <div className="flex-1">
        {activeTab === "bookings" && <BookingRequests search={search} />}
        {activeTab === "offline"  && <OfflineRentals  search={search} />}
        {activeTab === "rentals"  && <RentalsManagement search={search} />}
      </div>

    </div>
  );
}
