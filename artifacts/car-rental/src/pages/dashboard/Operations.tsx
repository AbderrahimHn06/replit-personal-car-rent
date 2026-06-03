import { useState } from "react";
import {
  Search, CalendarCheck, UserPlus, Key, Clock, CheckCircle2, AlertTriangle, FileDown,
} from "lucide-react";
import jsPDF from "jspdf";
import { bookingRequests, rentals, kpis, BookingRequest, DashboardRental } from "@/data/dashboardData";
import { useRentals, useT } from "@/data/localStore";
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

const SOURCE_LABEL: Record<string, string> = { online: "Website", "walk-in": "Walk-in", phone: "Phone" };

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function generateRentalsPDF(
  tab: OperationsTab,
  rentalsData: DashboardRental[],
  bookingsData: BookingRequest[],
  search: string,
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pw = 297;
  const ph = 210;
  const ml = 14;
  const cw = pw - ml * 2;

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
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
    pw - ml, 12, { align: "right" }
  );
  if (search) {
    doc.setTextColor(160, 180, 210);
    doc.setFontSize(7.5);
    doc.text(`Search: "${search}"`, ml, 28);
  }

  let y = 44;

  if (tab === "rentals" || tab === "offline") {
    const cols = [
      { label: "Reference", w: 30 }, { label: "Client", w: 40 }, { label: "Vehicle", w: 36 },
      { label: "Plate", w: 24 }, { label: "Start", w: 22 }, { label: "End", w: 22 },
      { label: "Location", w: 38 }, { label: "Total", w: 18 }, { label: "Deposit", w: 18 },
      { label: "Source", w: 20 }, { label: "Status", w: 20 },
    ];
    doc.setFillColor(245, 247, 250);
    doc.rect(ml, y - 5, cw, 9, "F");
    let x = ml + 2;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 100, 130);
    cols.forEach(({ label, w }) => { doc.text(label, x, y); x += w; });
    y += 6;
    const statusColors: Record<string, [number, number, number]> = {
      active: [5, 150, 105], reserved: [79, 70, 229], overdue: [220, 38, 38], completed: [100, 116, 139],
    };
    doc.setFont("helvetica", "normal");
    rentalsData.forEach((r, i) => {
      if (y > ph - 20) { doc.addPage(); y = 20; }
      if (i % 2 === 0) { doc.setFillColor(250, 251, 252); doc.rect(ml, y - 4.5, cw, 8, "F"); }
      doc.setFontSize(8); doc.setTextColor(30, 35, 50);
      x = ml + 2;
      const cells = [r.reference, r.client, r.car, r.plate, fmtDate(r.startDate), fmtDate(r.endDate), r.pickupLocation, `$${r.totalPrice}`, `$${r.deposit}`, SOURCE_LABEL[r.source] ?? r.source];
      const colWidths = cols.map(c => c.w);
      cells.forEach((cell, ci) => { doc.text(doc.splitTextToSize(cell, colWidths[ci] - 2)[0], x, y); x += colWidths[ci]; });
      const [sr, sg, sb] = statusColors[r.status] ?? [100, 116, 139];
      doc.setFillColor(sr, sg, sb);
      doc.roundedRect(x - 2, y - 4, 18, 6, 1.5, 1.5, "F");
      doc.setTextColor(255, 255, 255); doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
      doc.text(r.status.toUpperCase(), x + 7, y, { align: "center" });
      doc.setFont("helvetica", "normal"); doc.setTextColor(30, 35, 50); doc.setFontSize(8);
      y += 9;
    });
    if (rentalsData.length === 0) { doc.setTextColor(150, 160, 170); doc.setFontSize(10); doc.text("No records found.", pw / 2, y + 10, { align: "center" }); }
  }

  if (tab === "bookings") {
    const cols = [
      { label: "Customer", w: 44 }, { label: "Phone", w: 32 }, { label: "Vehicle", w: 36 },
      { label: "Pickup Date", w: 26 }, { label: "Return Date", w: 26 }, { label: "Pickup Loc.", w: 40 },
      { label: "Return Loc.", w: 40 }, { label: "Status", w: 22 }, { label: "Submitted", w: 30 },
    ];
    let x = ml + 2;
    doc.setFillColor(245, 247, 250);
    doc.rect(ml, y - 5, cw, 9, "F");
    doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(80, 100, 130);
    cols.forEach(({ label, w }) => { doc.text(label, x, y); x += w; });
    y += 6;
    const statusColors: Record<string, [number, number, number]> = {
      new: [59, 130, 246], contacted: [245, 158, 11], confirmed: [5, 150, 105], cancelled: [100, 116, 139],
    };
    doc.setFont("helvetica", "normal");
    bookingsData.forEach((r, i) => {
      if (y > ph - 20) { doc.addPage(); y = 20; }
      if (i % 2 === 0) { doc.setFillColor(250, 251, 252); doc.rect(ml, y - 4.5, cw, 8, "F"); }
      doc.setFontSize(8); doc.setTextColor(30, 35, 50);
      x = ml + 2;
      const colWidths = cols.map(c => c.w);
      const cells = [r.customer, r.phone, r.car, fmtDate(r.pickupDate), fmtDate(r.returnDate), r.pickupLocation, r.returnLocation];
      cells.forEach((cell, ci) => { doc.text(doc.splitTextToSize(cell, colWidths[ci] - 2)[0], x, y); x += colWidths[ci]; });
      const [sr, sg, sb] = statusColors[r.status] ?? [100, 116, 139];
      doc.setFillColor(sr, sg, sb);
      doc.roundedRect(x - 1, y - 4, 20, 6, 1.5, 1.5, "F");
      doc.setTextColor(255, 255, 255); doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
      doc.text(r.status.toUpperCase(), x + 9, y, { align: "center" });
      x += colWidths[7];
      doc.setFont("helvetica", "normal"); doc.setTextColor(30, 35, 50); doc.setFontSize(8);
      doc.text(r.submittedAt, x, y);
      y += 9;
    });
    if (bookingsData.length === 0) { doc.setTextColor(150, 160, 170); doc.setFontSize(10); doc.text("No records found.", pw / 2, y + 10, { align: "center" }); }
  }

  const totalRecords = tab === "bookings" ? bookingsData.length : rentalsData.length;
  doc.setFillColor(26, 35, 50);
  doc.rect(0, ph - 12, pw, 12, "F");
  doc.setTextColor(160, 180, 210); doc.setFontSize(7.5); doc.setFont("helvetica", "normal");
  doc.text(`EliteRide Car Rental  ·  Total records: ${totalRecords}  ·  Exported ${new Date().toLocaleString("en-GB")}`, pw / 2, ph - 4.5, { align: "center" });
  const fileName = tab === "bookings" ? "bookings-report" : tab === "offline" ? "walkin-rentals-report" : "rentals-report";
  doc.save(`${fileName}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

interface Props {
  activeTab: OperationsTab;
  onTabChange: (t: OperationsTab) => void;
}

const newCount       = bookingRequests.filter(r => r.status === "new").length;
const walkInActive   = rentals.filter(r => r.source === "walk-in" && (r.status === "active" || r.status === "overdue")).length;
const confirmedToday = bookingRequests.filter(r => r.status === "confirmed").length;

export function OperationsSection({ activeTab, onTabChange }: Props) {
  const [search, setSearch] = useState("");
  const allRentals = useRentals();
  const t = useT();

  const OPS_KPIS = [
    { labelKey: "kpi.bookingRequests", value: bookingRequests.length, subKey: "kpi.sub.newCount",      subVal: newCount,       color: "text-violet-600",  bg: "bg-violet-50",  icon: CalendarCheck  },
    { labelKey: "kpi.walkInRentals",   value: walkInActive,           subKey: "kpi.sub.activeCounter", subVal: null,           color: "text-emerald-600", bg: "bg-emerald-50", icon: UserPlus       },
    { labelKey: "kpi.activeRentals",   value: kpis.activeRentals,     subKey: "kpi.sub.onTheRoad",     subVal: null,           color: "text-sky-600",     bg: "bg-sky-50",     icon: Key            },
    { labelKey: "kpi.pendingActions",  value: newCount,               subKey: "kpi.sub.needResponse",  subVal: null,           color: "text-amber-600",   bg: "bg-amber-50",   icon: Clock          },
    { labelKey: "kpi.confirmedToday",  value: confirmedToday,         subKey: "kpi.sub.confirmed",     subVal: null,           color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2   },
    { labelKey: "kpi.overdueReturns",  value: kpis.overdueRentals,    subKey: "kpi.sub.followUpNow",   subVal: null,           color: "text-red-500",     bg: "bg-red-50",     icon: AlertTriangle  },
  ];

  const TABS = [
    { id: "bookings" as OperationsTab, labelKey: "ops.tab.bookings", icon: CalendarCheck, badge: newCount },
    { id: "offline"  as OperationsTab, labelKey: "ops.tab.walkin",   icon: UserPlus },
    { id: "rentals"  as OperationsTab, labelKey: "ops.tab.rentals",  icon: Key, badge: kpis.activeRentals },
  ];

  function applyRentalSearch(list: DashboardRental[]): DashboardRental[] {
    return list.filter(r => !search || [r.client, r.car, r.plate, r.reference].some(v => v.toLowerCase().includes(search.toLowerCase())));
  }
  function applyBookingSearch(list: BookingRequest[]): BookingRequest[] {
    return list.filter(r => !search || [r.customer, r.car, r.email, r.phone].some(v => v.toLowerCase().includes(search.toLowerCase())));
  }
  function handleExportPDF() {
    if (activeTab === "bookings") generateRentalsPDF("bookings", [], applyBookingSearch(bookingRequests), search);
    else if (activeTab === "offline") generateRentalsPDF("offline", applyRentalSearch(allRentals.filter(r => r.source === "walk-in")), [], search);
    else generateRentalsPDF("rentals", applyRentalSearch(allRentals), [], search);
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fb]">
      <div className="px-6 sm:px-8 pt-7 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] font-bold text-[#1a2332] tracking-tight">{t("ops.title")}</h2>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">{t("ops.sub")}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder={t("ops.searchPlaceholder")}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 h-10 w-52 rounded-xl border border-slate-200 bg-white text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 shadow-sm transition"
              />
            </div>
            <button
              onClick={handleExportPDF}
              className="h-10 px-3.5 flex items-center gap-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all duration-200 cursor-pointer"
            >
              <FileDown className="h-4 w-4 text-slate-500" />
              <span className="hidden sm:inline">{t("action.exportPDF")}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {OPS_KPIS.map(({ labelKey, value, subKey, subVal, color, bg, icon: Icon }) => {
            const sub = subVal !== null ? `${subVal} ${t(subKey as any)}` : t(subKey as any);
            return (
              <div key={labelKey} className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <p className={`text-[26px] font-bold ${color} leading-none tabular-nums mb-1`}>{value}</p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 leading-tight mb-1">{t(labelKey as any)}</p>
                <p className="text-[11px] text-slate-400">{sub}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap pb-0">
          {TABS.map(({ id, labelKey, icon: Icon, badge }) => {
            const active = activeTab === id;
            return (
              <button key={id} onClick={() => onTabChange(id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                  active ? "bg-[#1a2332] text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 shadow-sm"
                }`}
              >
                <Icon className="h-[15px] w-[15px] flex-shrink-0" />
                {t(labelKey as any)}
                {badge !== undefined && badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${active ? "bg-white/20 text-white" : "bg-violet-600 text-white"}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-6 sm:mx-8 mt-4 border-t border-slate-200" />

      <div className="flex-1">
        {activeTab === "bookings" && <BookingRequests search={search} filters={BLANK_FILTERS} />}
        {activeTab === "offline"  && <OfflineRentals  search={search} filters={BLANK_FILTERS} />}
        {activeTab === "rentals"  && <RentalsManagement search={search} filters={BLANK_FILTERS} />}
      </div>
    </div>
  );
}
