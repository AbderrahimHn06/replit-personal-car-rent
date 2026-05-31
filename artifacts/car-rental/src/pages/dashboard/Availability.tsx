import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fleet, rentals } from "@/data/dashboardData";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

function getCarStatus(carName: string, dateStr: string): "available" | "reserved" | "rented" | "maintenance" {
  const car = fleet.find(c => `${c.brand} ${c.model}` === carName);
  if (car?.status === "maintenance") return "maintenance";
  const rental = rentals.find(r => {
    const matchesCar = r.car === carName;
    const inRange = dateStr >= r.startDate && dateStr <= r.endDate;
    return matchesCar && inRange;
  });
  if (!rental) return "available";
  if (rental.status === "reserved") return "reserved";
  if (rental.status === "active" || rental.status === "overdue") return "rented";
  return "available";
}

const CELL_STYLES: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-700",
  reserved: "bg-indigo-50 text-indigo-700",
  rented: "bg-amber-50 text-amber-700",
  maintenance: "bg-red-50 text-red-600",
};

const CELL_LABELS: Record<string, string> = {
  available: "Free",
  reserved: "Rsvd",
  rented: "Out",
  maintenance: "Maint",
};

export function AvailabilitySection() {
  const [weekStart, setWeekStart] = useState<Date>(getMonday(new Date()));

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const weekLabel = `${toISO(weekStart)} — ${toISO(addDays(weekStart, 6))}`;

  const prevWeek = () => setWeekStart(d => addDays(d, -7));
  const nextWeek = () => setWeekStart(d => addDays(d, 7));
  const today = () => setWeekStart(getMonday(new Date()));

  const cars = fleet.map(c => `${c.brand} ${c.model}`);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-800">Availability</h2>
          <p className="text-xs text-slate-500 mt-0.5">Weekly car availability overview</p>
        </div>
        <button onClick={today} className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          This week
        </button>
      </div>

      {/* Week nav */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={prevWeek} className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-slate-700 font-mono">{weekLabel}</span>
        <button onClick={nextWeek} className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        {[
          { label: "Available", color: "bg-emerald-400" },
          { label: "Reserved", color: "bg-indigo-400" },
          { label: "Rented", color: "bg-amber-400" },
          { label: "Maintenance", color: "bg-red-400" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-[11px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider w-36 sticky left-0 bg-slate-50">Vehicle</th>
                {days.map((d, i) => {
                  const isToday = toISO(d) === toISO(new Date());
                  return (
                    <th key={i} className={`px-2 py-3 text-center font-bold uppercase tracking-wider ${isToday ? "text-primary" : "text-slate-500"}`}>
                      <div>{DAY_LABELS[i]}</div>
                      <div className={`text-[11px] font-normal ${isToday ? "text-primary font-bold" : "text-slate-400"}`}>
                        {d.getDate()}/{d.getMonth() + 1}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cars.map((carName, ci) => (
                <tr key={ci} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5 sticky left-0 bg-white hover:bg-slate-50/50">
                    <div>
                      <p className="font-semibold text-slate-700 text-xs">{carName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{fleet[ci]?.plate}</p>
                    </div>
                  </td>
                  {days.map((d, di) => {
                    const dateStr = toISO(d);
                    const status = getCarStatus(carName, dateStr);
                    const isToday = dateStr === toISO(new Date());
                    return (
                      <td key={di} className={`px-1 py-2 text-center ${isToday ? "bg-primary/4" : ""}`}>
                        <span className={`inline-flex items-center justify-center w-12 h-7 rounded-lg text-[10px] font-bold ${CELL_STYLES[status]}`}>
                          {CELL_LABELS[status]}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
