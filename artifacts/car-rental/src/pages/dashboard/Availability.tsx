import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fleet, rentals } from "@/data/dashboardData";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function toISO(d: Date) {
  return d.toISOString().split("T")[0];
}
function getMonday(d: Date) {
  const day = d.getDay() || 7;
  return addDays(d, 1 - day);
}

type CellStatus = "free" | "reserved" | "rented" | "maintenance";

function getCarStatus(plateOrName: string, dateStr: string): CellStatus {
  const car = fleet.find(c => `${c.brand} ${c.model}` === plateOrName);
  if (car?.status === "maintenance") return "maintenance";
  const rental = rentals.find(r => {
    return r.car === plateOrName && dateStr >= r.startDate && dateStr <= r.endDate;
  });
  if (!rental) return "free";
  if (rental.status === "reserved") return "reserved";
  if (rental.status === "active" || rental.status === "overdue") return "rented";
  return "free";
}

const STATUS_CONFIG: Record<CellStatus, { label: string; bg: string; text: string; border: string }> = {
  free:        { label: "Free",        bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-100" },
  reserved:    { label: "Reserved",    bg: "bg-indigo-50",   text: "text-indigo-700",  border: "border-indigo-100" },
  rented:      { label: "Rented",      bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-100" },
  maintenance: { label: "Maintenance", bg: "bg-red-50",      text: "text-red-600",     border: "border-red-100" },
};

const LEGEND_COLORS: Record<CellStatus, string> = {
  free:        "bg-emerald-500",
  reserved:    "bg-indigo-500",
  rented:      "bg-amber-400",
  maintenance: "bg-red-400",
};

export function AvailabilitySection() {
  const [weekStart, setWeekStart] = useState<Date>(getMonday(new Date()));

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = toISO(new Date());

  const prevWeek = () => setWeekStart(d => addDays(d, -7));
  const nextWeek = () => setWeekStart(d => addDays(d, 7));
  const goToday = () => setWeekStart(getMonday(new Date()));

  const weekRange = `${days[0].toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${days[6].toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <div className="p-5 sm:p-7 space-y-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-bold text-[#1a2332]">Availability Schedule</h2>
          <p className="text-xs text-slate-400 mt-0.5">Weekly vehicle availability — {weekRange}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Legend */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["free", "reserved", "rented", "maintenance"] as CellStatus[]).map(s => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-sm ${LEGEND_COLORS[s]}`} />
                <span className="text-[11px] text-slate-500 font-medium capitalize">{STATUS_CONFIG[s].label}</span>
              </div>
            ))}
          </div>

          {/* Week nav */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevWeek}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors shadow-sm"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={goToday}
              className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap"
            >
              This week
            </button>
            <button
              onClick={nextWeek}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors shadow-sm"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule board */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            {/* Header row */}
            <thead>
              <tr>
                {/* Vehicle col header */}
                <th className="w-44 px-5 py-3 bg-slate-50 border-b border-r border-slate-200 text-left sticky left-0 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vehicle</span>
                </th>
                {days.map((d, i) => {
                  const isToday = toISO(d) === today;
                  return (
                    <th
                      key={i}
                      className={`px-2 py-3 border-b border-r border-slate-200 text-center last:border-r-0 ${
                        isToday ? "bg-primary/6" : "bg-slate-50"
                      }`}
                    >
                      <span className={`block text-[10px] font-bold uppercase tracking-widest ${isToday ? "text-primary" : "text-slate-400"}`}>
                        {DAYS_SHORT[i]}
                      </span>
                      <span className={`block text-[13px] font-bold mt-0.5 ${isToday ? "text-primary" : "text-slate-600"}`}>
                        {d.getDate()}
                      </span>
                      <span className={`block text-[10px] font-medium ${isToday ? "text-primary/70" : "text-slate-400"}`}>
                        {d.toLocaleDateString("en-GB", { month: "short" })}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {fleet.map((car, ci) => {
                const carName = `${car.brand} ${car.model}`;
                return (
                  <tr
                    key={car.id}
                    className="group border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Vehicle label — sticky left col */}
                    <td className="px-5 py-4 border-r border-slate-200 sticky left-0 bg-white group-hover:bg-slate-50/60 transition-colors z-10">
                      <p className="text-[13px] font-bold text-slate-800 leading-tight">{carName}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{car.plate}</p>
                    </td>

                    {/* Day cells */}
                    {days.map((d, di) => {
                      const dateStr = toISO(d);
                      const status = getCarStatus(carName, dateStr);
                      const cfg = STATUS_CONFIG[status];
                      const isToday = dateStr === today;

                      return (
                        <td
                          key={di}
                          className={`px-2 py-3 border-r border-slate-100 last:border-r-0 text-center ${
                            isToday ? "bg-primary/4" : ""
                          }`}
                        >
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg border text-[11px] font-bold w-full max-w-[90px] mx-auto ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            {cfg.label}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer key */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-400">
        <span>Data shown reflects confirmed rentals, reservations, and scheduled maintenance.</span>
        <span>·</span>
        <span>Today is highlighted in blue.</span>
      </div>
    </div>
  );
}
