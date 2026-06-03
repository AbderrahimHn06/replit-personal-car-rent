import { useState, useRef, useEffect } from "react";
import {
  Search, SlidersHorizontal,
  CalendarCheck, UserPlus, Key, Clock, CheckCircle2, AlertTriangle, X,
  FileDown,
} from "lucide-react";
import jsPDF from "jspdf";
import { bookingRequests, rentals, kpis, BookingRequest, DashboardRental } from "@/data/dashboardData";
import { useRentals } from "@/data/localStore";
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

const SOURCE_LABEL: Record<string, string> = { online: "Website", "walk-in": "Walk-in", phone: "Phone" };

/* ── PDF generation ───────────────────────────────────────────── */

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function generateRentalsPDF(
  tab: OperationsTab,
  rentalsData: DashboardRental[],
  bookingsData: BookingRequest[],
  filters: RentalFilters,
  search: string,
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pw = 297;
  const ph = 210;
  const ml = 14;
  const cw = pw - ml * 2;

  /* ── Header bar ── */
  doc.setFillColor(26, 35, 50);
  doc.rect(0, 0, pw, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("ELITERIDE", ml, 12);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 180, 210);
  const tabLabel = tab === "bookings" ? "Booking Requests Report"
                 : tab === "offline"  ? "Walk-in Rentals Report"
                 :                     "Rentals Report";
  doc.text(tabLabel, ml, 20);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, pw - ml, 12, { align: "right" });

  /* ── Active filters summary ── */
  const filterParts: string[] = [];
  if (filters.source !== "all") filterParts.push(`Source: ${SOURCE_LABEL[filters.source] ?? filters.source}`);
  if (filters.dateFrom)         filterParts.push(`From: ${fmtDate(filters.dateFrom)}`);
  if (filters.dateTo)           filterParts.push(`To: ${fmtDate(filters.dateTo)}`);
  if (filters.location !== "all") filterParts.push(`Location: ${filters.location}`);
  if (search)                   filterParts.push(`Search: "${search}"`);
  if (filterParts.length > 0) {
    doc.setTextColor(160, 180, 210);
    doc.setFontSize(7.5);
    doc.text(`Filters — ${filterParts.join("  ·  ")}`, ml, 28);
  }

  let y = 44;

  /* ── RENTALS table ── */
  if (tab === "rentals" || tab === "offline") {
    const cols = [
      { label: "Reference",      w: 30 },
      { label: "Client",         w: 40 },
      { label: "Vehicle",        w: 36 },
      { label: "Plate",          w: 24 },
      { label: "Start",          w: 22 },
      { label: "End",            w: 22 },
      { label: "Location",       w: 38 },
      { label: "Total",          w: 18 },
      { label: "Deposit",        w: 18 },
      { label: "Source",         w: 20 },
      { label: "Status",         w: 20 },
    ];

    /* Header row */
    doc.setFillColor(245, 247, 250);
    doc.rect(ml, y - 5, cw, 9, "F");
    let x = ml + 2;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 100, 130);
    cols.forEach(({ label, w }) => { doc.text(label, x, y); x += w; });
    y += 6;

    /* Data rows */
    const statusColors: Record<string, [number, number, number]> = {
      active:    [5,   150, 105],
      reserved:  [79,  70,  229],
      overdue:   [220, 38,  38 ],
      completed: [100, 116, 139],
    };

    doc.setFont("helvetica", "normal");
    rentalsData.forEach((r, i) => {
      if (y > ph - 20) { doc.addPage(); y = 20; }
      if (i % 2 === 0) {
        doc.setFillColor(250, 251, 252);
        doc.rect(ml, y - 4.5, cw, 8, "F");
      }
      doc.setFontSize(8);
      doc.setTextColor(30, 35, 50);
      x = ml + 2;
      const cells = [
        r.reference, r.client, r.car, r.plate,
        fmtDate(r.startDate), fmtDate(r.endDate),
        r.pickupLocation,
        `$${r.totalPrice}`, `$${r.deposit}`,
        SOURCE_LABEL[r.source] ?? r.source,
      ];
      const colWidths = cols.map(c => c.w);
      cells.forEach((cell, ci) => {
        const maxW = colWidths[ci] - 2;
        const lines = doc.splitTextToSize(cell, maxW);
        doc.text(lines[0], x, y);
        x += colWidths[ci];
      });
      /* Status pill */
      const [sr, sg, sb] = statusColors[r.status] ?? [100, 116, 139];
      doc.setFillColor(sr, sg, sb);
      doc.roundedRect(x - 2, y - 4, 18, 6, 1.5, 1.5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.text(r.status.toUpperCase(), x + 7, y, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 35, 50);
      doc.setFontSize(8);
      y += 9;
    });

    if (rentalsData.length === 0) {
      doc.setTextColor(150, 160, 170);
      doc.setFontSize(10);
      doc.text("No records match the current filters.", pw / 2, y + 10, { align: "center" });
    }
  }

  /* ── BOOKINGS table ── */
  if (tab === "bookings") {
    const cols = [
      { label: "Customer",      w: 44 },
      { label: "Phone",         w: 32 },
      { label: "Vehicle",       w: 36 },
      { label: "Pickup Date",   w: 26 },
      { label: "Return Date",   w: 26 },
      { label: "Pickup Loc.",   w: 40 },
      { label: "Return Loc.",   w: 40 },
      { label: "Status",        w: 22 },
      { label: "Submitted",     w: 30 },
    ];

    let x = ml + 2;
    doc.setFillColor(245, 247, 250);
    doc.rect(ml, y - 5, cw, 9, "F");
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 100, 130);
    cols.forEach(({ label, w }) => { doc.text(label, x, y); x += w; });
    y += 6;

    const statusColors: Record<string, [number, number, number]> = {
      new:       [59,  130, 246],
      contacted: [245, 158, 11 ],
      confirmed: [5,   150, 105],
      cancelled: [100, 116, 139],
    };

    doc.setFont("helvetica", "normal");
    bookingsData.forEach((r, i) => {
      if (y > ph - 20) { doc.addPage(); y = 20; }
      if (i % 2 === 0) {
        doc.setFillColor(250, 251, 252);
        doc.rect(ml, y - 4.5, cw, 8, "F");
      }
      doc.setFontSize(8);
      doc.setTextColor(30, 35, 50);
      x = ml + 2;
      const cells = [
        r.customer, r.phone, r.car,
        fmtDate(r.pickupDate), fmtDate(r.returnDate),
        r.pickupLocation, r.returnLocation,
        "", // status pill below
        r.submittedAt,
      ];
      const colWidths = cols.map(c => c.w);
      cells.forEach((cell, ci) => {
        if (ci === 7) { x += colWidths[ci]; return; } // skip status col
        const maxW = colWidths[ci] - 2;
        const lines = doc.splitTextToSize(cell, maxW);
        doc.text(lines[0], x, y);
        x += colWidths[ci];
      });
      /* Status pill - at col 7 */
      const statusX = ml + 2 + colWidths.slice(0, 7).reduce((a, b) => a + b, 0);
      const [sr, sg, sb] = statusColors[r.status] ?? [100, 116, 139];
      doc.setFillColor(sr, sg, sb);
      doc.roundedRect(statusX - 1, y - 4, 20, 6, 1.5, 1.5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.text(r.status.toUpperCase(), statusX + 9, y, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 35, 50);
      doc.setFontSize(8);
      y += 9;
    });

    if (bookingsData.length === 0) {
      doc.setTextColor(150, 160, 170);
      doc.setFontSize(10);
      doc.text("No records match the current filters.", pw / 2, y + 10, { align: "center" });
    }
  }

  /* ── Summary footer on last page ── */
  const totalRecords = tab === "bookings" ? bookingsData.length : rentalsData.length;
  doc.setFillColor(26, 35, 50);
  doc.rect(0, ph - 12, pw, 12, "F");
  doc.setTextColor(160, 180, 210);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    `EliteRide Car Rental  ·  Total records: ${totalRecords}  ·  Exported ${new Date().toLocaleString("en-GB")}`,
    pw / 2, ph - 4.5, { align: "center" }
  );

  const fileName = tab === "bookings" ? "bookings-report"
                 : tab === "offline"  ? "walkin-rentals-report"
                 :                     "rentals-report";
  doc.save(`${fileName}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

/* ── Filter panel ─────────────────────────────────────────────── */
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
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <span className="text-[13px] font-bold text-slate-700">Filter Rentals</span>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-400 transition-colors cursor-pointer">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Source</p>
          <div className="grid grid-cols-2 gap-1.5">
            {SOURCE_OPTIONS.map(({ value, label }) => {
              const active = filters.source === value;
              return (
                <button key={value} onClick={() => onChange({ source: value })}
                  className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition-all duration-150 cursor-pointer text-left ${
                    active ? "bg-[#1a2332] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Start Date Range</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 font-medium mb-1 block">From</label>
              <input type="date" value={filters.dateFrom} onChange={e => onChange({ dateFrom: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2332]/20 focus:border-[#1a2332]/40 transition cursor-pointer" />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-medium mb-1 block">To</label>
              <input type="date" value={filters.dateTo} onChange={e => onChange({ dateTo: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2332]/20 focus:border-[#1a2332]/40 transition cursor-pointer" />
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Pickup Location</p>
          <select value={filters.location} onChange={e => onChange({ location: e.target.value })}
            className="w-full h-9 px-3 rounded-xl border border-slate-200 text-[12px] text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2332]/20 focus:border-[#1a2332]/40 transition cursor-pointer appearance-none">
            <option value="all">All locations</option>
            {ALL_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center justify-between gap-2">
        <button onClick={onClear} disabled={count === 0}
          className="px-4 py-2 rounded-xl border border-slate-200 text-[12px] font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
          Clear all
        </button>
        <button onClick={onClose}
          className="px-4 py-2 rounded-xl bg-[#1a2332] text-white text-[12px] font-semibold hover:bg-[#243044] transition-colors cursor-pointer">
          Apply{count > 0 ? ` (${count})` : ""}
        </button>
      </div>
    </div>
  );
}

/* ── Main section ─────────────────────────────────────────────── */
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

  /* All rentals from live store */
  const allRentals = useRentals();

  function mergeFilters(partial: Partial<RentalFilters>) {
    setFilters(prev => ({ ...prev, ...partial }));
  }

  /* Close filter panel on outside click */
  useEffect(() => {
    if (!showFilters) return;
    function handle(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current   && !btnRef.current.contains(e.target as Node)
      ) setShowFilters(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showFilters]);

  /* Compute filtered data for PDF export (mirrors child component logic) */
  function applyRentalFilters(list: DashboardRental[]): DashboardRental[] {
    return list.filter(r => {
      const ms   = !search || [r.client, r.car, r.plate, r.reference].some(v => v.toLowerCase().includes(search.toLowerCase()));
      const fsrc = filters.source === "all" || r.source === filters.source;
      const fFrom = !filters.dateFrom || r.startDate >= filters.dateFrom;
      const fTo   = !filters.dateTo   || r.startDate <= filters.dateTo;
      const fLoc  = filters.location === "all" || r.pickupLocation === filters.location;
      return ms && fsrc && fFrom && fTo && fLoc;
    });
  }

  function applyBookingFilters(list: BookingRequest[]): BookingRequest[] {
    return list.filter(r => {
      const ms   = !search || [r.customer, r.car, r.email, r.phone].some(v => v.toLowerCase().includes(search.toLowerCase()));
      const fsrc = filters.source === "all" || r.source === filters.source;
      const fFrom = !filters.dateFrom || r.pickupDate >= filters.dateFrom;
      const fTo   = !filters.dateTo   || r.pickupDate <= filters.dateTo;
      const fLoc  = filters.location === "all" || r.pickupLocation === filters.location;
      return ms && fsrc && fFrom && fTo && fLoc;
    });
  }

  function handleExportPDF() {
    if (activeTab === "bookings") {
      generateRentalsPDF("bookings", [], applyBookingFilters(bookingRequests), filters, search);
    } else if (activeTab === "offline") {
      const walkIns = allRentals.filter(r => r.source === "walk-in");
      generateRentalsPDF("offline", applyRentalFilters(walkIns), [], filters, search);
    } else {
      generateRentalsPDF("rentals", applyRentalFilters(allRentals), [], filters, search);
    }
  }

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
            {/* Search */}
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

            {/* Export PDF button */}
            <button
              onClick={handleExportPDF}
              className="h-10 px-3.5 flex items-center gap-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all duration-200 cursor-pointer"
            >
              <FileDown className="h-4 w-4 text-slate-500" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            {/* Clear filters chip */}
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
              <button key={id} onClick={() => onTabChange(id)}
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
