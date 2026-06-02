import { useState, useRef, useEffect } from "react";
import {
  Search, SlidersHorizontal,
  CalendarCheck, UserPlus, Key, Clock, CheckCircle2, AlertTriangle, X,
} from "lucide-react";
import { bookingRequests, rentals, kpis } from "@/data/dashboardData";
import { BookingRequests } from "./BookingRequests";
import { OfflineRentals } from "./OfflineRentals";
import { RentalsManagement } from "./RentalsManagement";

export type OperationsTab = "bookings" | "offline" | "rentals";

export interface RentalFilters {
  source:   "all" | "online" | "walk-in" | "phone";
  dateFrom: string;
  dateTo:   string;
  location: string;
}

const BLANK_FILTERS: RentalFilters = { source: "all", dateFrom: "", dateTo: "", location: "all" };

function activeCount(f: RentalFilters) {
  let n = 0;
  if (f.source !== "all")    n++;
  if (f.dateFrom)            n++;
  if (f.dateTo)              n++;
  if (f.location !== "all")  n++;
  return n;
}

const ALL_LOCATIONS = [
  "Agency Main Office",
  "Oran Airport",
  "Oran City Center",
  "USTO University",
];

const SOURCE_OPTIONS: { value: RentalFilters["source"]; label: string }[] = [
  { value: "all",     label: "All sources"  },
  { value: "online",  label: "Website"      },
  { value: "walk-in", label: "Walk-in"      },
  { value: "phone",   label: "Phone"        },
];

function FilterPanel({
  filters,
  onChange,
  onClear,
  onClose,
}: {
  filters: RentalFilters;
  onChange: (f: Partial<RentalFilters>) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const count = activeCount(filters);

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[320px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <span className="text-[13px] font-bold text-slate-700">Filter Rentals</span>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-400 transition-colors cursor-pointer">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-5">

        {/* Source */}
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Source</p>
          <div className="grid grid-cols-2 gap-1.5">
            {SOURCE_OPTIONS.map(({ value, label }) => {
              const active = filters.source === value;
              return (
                <button
                  key={value}
                  onClick={() => onChange({ source: value })}
                  className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition-all duration-150 cursor-pointer text-left ${
                    active
                      ? "bg-[#1a2332] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date range */}
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Start Date Range</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 font-medium mb-1 block">From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={e => onChange({ dateFrom: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2332]/20 focus:border-[#1a2332]/40 transition cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-medium mb-1 block">To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={e => onChange({ dateTo: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2332]/20 focus:border-[#1a2332]/40 transition cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Pickup Location</p>
          <select
            value={filters.location}
            onChange={e => onChange({ location: e.target.value })}
            className="w-full h-9 px-3 rounded-xl border border-slate-200 text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2332]/20 focus:border-[#1a2332]/40 transition cursor-pointer appearance-none"
          >
            <option value="all">All locations</option>
            {ALL_LOCATIONS.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between gap-2">
        <button
          onClick={onClear}
          disabled={count === 0}
          className="px-4 py-2 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Clear all
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-[#1a2332] text-white text-[12px] font-semibold hover:bg-[#243044] transition-colors cursor-pointer"
        >
          Apply{count > 0 ? ` (${count})` : ""}
        </button>
      </div>
    </div>
  );
}

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
  const [search,      setSearch]      = useState("");
  const [filters,     setFilters]     = useState<RentalFilters>(BLANK_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef   = useRef<HTMLButtonElement>(null);

  const fCount = activeCount(filters);

  function mergeFilters(partial: Partial<RentalFilters>) {
    setFilters(prev => ({ ...prev, ...partial }));
  }

  /* Close panel on outside click */
  useEffect(() => {
    if (!showFilters) return;
    function handle(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current   && !btnRef.current.contains(e.target as Node)
      ) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showFilters]);

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

            {/* Filter button + panel */}
            <div className="relative">
              <button
                ref={btnRef}
                onClick={() => setShowFilters(p => !p)}
                className={`h-10 px-3.5 flex items-center gap-2 rounded-xl text-[13px] font-medium shadow-sm transition-all duration-200 cursor-pointer border ${
                  showFilters || fCount > 0
                    ? "bg-[#1a2332] text-white border-[#1a2332]"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                {fCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-[10px] font-bold text-white">
                    {fCount}
                  </span>
                )}
              </button>

              {showFilters && (
                <div ref={panelRef}>
                  <FilterPanel
                    filters={filters}
                    onChange={mergeFilters}
                    onClear={() => setFilters(BLANK_FILTERS)}
                    onClose={() => setShowFilters(false)}
                  />
                </div>
              )}
            </div>

            {/* Active filter chips */}
            {fCount > 0 && (
              <button
                onClick={() => setFilters(BLANK_FILTERS)}
                className="h-10 px-3.5 flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 text-[12px] font-semibold text-red-600 hover:bg-red-100 transition-all duration-200 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" /> Clear filters
              </button>
            )}
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
        {activeTab === "bookings" && <BookingRequests search={search} filters={filters} />}
        {activeTab === "offline"  && <OfflineRentals  search={search} filters={filters} />}
        {activeTab === "rentals"  && <RentalsManagement search={search} filters={filters} />}
      </div>

    </div>
  );
}
