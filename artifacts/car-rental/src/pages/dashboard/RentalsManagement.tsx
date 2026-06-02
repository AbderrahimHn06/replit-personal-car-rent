import { useState } from "react";
import { X, CheckCircle2, AlertTriangle, Eye, Printer, CalendarPlus, Phone, Search } from "lucide-react";
import { DashboardRental, RentalStatus } from "@/data/dashboardData";
import { useRentals, updateRental } from "@/data/localStore";

const STATUS_CFG: Record<RentalStatus, { cls: string; label: string; dot: string }> = {
  active:    { cls: "bg-emerald-50 text-emerald-700 border border-emerald-100", label: "Active",    dot: "bg-emerald-500" },
  reserved:  { cls: "bg-indigo-50 text-indigo-700 border border-indigo-100",   label: "Reserved",  dot: "bg-indigo-500"  },
  overdue:   { cls: "bg-red-50 text-red-700 border border-red-100",            label: "Overdue",   dot: "bg-red-500"     },
  completed: { cls: "bg-slate-100 text-slate-500 border border-slate-200",     label: "Completed", dot: "bg-slate-400"   },
};

function Badge({ s }: { s: RentalStatus }) {
  const { cls, label, dot } = STATUS_CFG[s];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function fmtShort(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const SOURCE_LABEL: Record<string, string> = { online: "Website", "walk-in": "Walk-in", phone: "Phone" };

type FilterId = "all" | RentalStatus;
const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all",       label: "All"       },
  { id: "active",    label: "Active"    },
  { id: "reserved",  label: "Reserved"  },
  { id: "overdue",   label: "Overdue"   },
  { id: "completed", label: "Completed" },
];

/* ── Detail Drawer ── */
function RentalDrawer({ rental, onClose, onReturn }: {
  rental: DashboardRental;
  onClose: () => void;
  onReturn: (id: string) => void;
}) {
  const isOverdue = rental.status === "overdue";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] bg-white shadow-2xl flex flex-col">

        <div className={`flex items-start justify-between px-7 py-6 border-b flex-shrink-0 ${isOverdue ? "bg-red-50 border-red-100" : "border-slate-100"}`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge s={rental.status} />
              <span className="text-[11px] text-slate-400 bg-white/80 border border-slate-200 px-2.5 py-1 rounded-full font-medium">
                {SOURCE_LABEL[rental.source]}
              </span>
            </div>
            <h3 className="text-[18px] font-bold text-[#1a2332] font-mono">{rental.reference}</h3>
            {isOverdue && (
              <div className="flex items-center gap-1.5 mt-2">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-[12px] text-red-600 font-semibold">Vehicle overdue — contact client immediately</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/80 text-slate-400 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">

          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Client Details</p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl divide-y divide-slate-100">
              {[
                { label: "Name",    value: rental.client        },
                { label: "Phone",   value: rental.clientPhone   },
                { label: "License", value: rental.driverLicense },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-4 py-3">
                  <span className="text-[11.5px] text-slate-400 font-medium">{label}</span>
                  <span className="text-[12.5px] text-slate-700 font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Vehicle</p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl divide-y divide-slate-100">
              {[
                { label: "Car",   value: rental.car   },
                { label: "Plate", value: rental.plate },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-4 py-3">
                  <span className="text-[11.5px] text-slate-400 font-medium">{label}</span>
                  <span className="text-[12.5px] text-slate-700 font-semibold text-right font-mono">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Rental Period</p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl divide-y divide-slate-100">
              {[
                { label: "Start date",      value: fmt(rental.startDate)         },
                { label: "End date",        value: fmt(rental.endDate)           },
                { label: "Pickup location", value: rental.pickupLocation         },
                ...(rental.returnLocation ? [{ label: "Return location", value: rental.returnLocation }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-4 py-3">
                  <span className="text-[11.5px] text-slate-400 font-medium">{label}</span>
                  <span className={`text-[12.5px] font-semibold text-right ${isOverdue && label === "End date" ? "text-red-600" : "text-slate-700"}`}>{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Payment Summary</p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl divide-y divide-slate-100">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[11.5px] text-slate-400 font-medium">Total price</span>
                <span className="text-[16px] font-bold text-[#1a2332]">${rental.totalPrice}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[11.5px] text-slate-400 font-medium">Deposit held</span>
                <span className="text-[12.5px] text-slate-700 font-semibold">${rental.deposit}</span>
              </div>
            </div>
          </section>

          {rental.notes && (
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Notes</p>
              <p className="text-[13px] text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">{rental.notes}</p>
            </section>
          )}

          {isOverdue && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[12.5px] font-bold text-red-700 mb-1">Vehicle Overdue</p>
                <p className="text-[12px] text-red-600 leading-relaxed">
                  This vehicle was due on {fmt(rental.endDate)}. Please contact the client urgently.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-7 py-5 flex flex-wrap gap-2.5 flex-shrink-0 bg-slate-50/60">
          {(rental.status === "active" || rental.status === "overdue") && (
            <>
              <button onClick={() => { onReturn(rental.id); onClose(); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[12.5px] font-semibold hover:bg-emerald-100 transition-colors">
                <CheckCircle2 className="h-4 w-4" /> Mark Returned
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 border border-sky-100 text-sky-700 rounded-xl text-[12.5px] font-semibold hover:bg-sky-100 transition-colors">
                <CalendarPlus className="h-4 w-4" /> Extend
              </button>
              <a href={`tel:${rental.clientPhone}`} className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-[12.5px] font-semibold hover:bg-amber-100 transition-colors">
                <Phone className="h-4 w-4" /> Call Client
              </a>
            </>
          )}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-[12.5px] font-semibold hover:bg-slate-200 transition-colors">
            <Printer className="h-4 w-4" /> Print Agreement
          </button>
          <button onClick={onClose} className="ml-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[12.5px] font-semibold hover:bg-slate-50 transition-colors">
            Close
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── Main ── */
export function RentalsManagement({ search = "" }: { search?: string }) {
  const [filter,   setFilter]   = useState<FilterId>("all");
  const [selected, setSelected] = useState<DashboardRental | null>(null);

  const local = useRentals();

  const markReturned = (id: string) => updateRental(id, { status: "completed" as RentalStatus });

  const counts: Record<string, number> = {
    all:       local.length,
    active:    local.filter(r => r.status === "active").length,
    reserved:  local.filter(r => r.status === "reserved").length,
    overdue:   local.filter(r => r.status === "overdue").length,
    completed: local.filter(r => r.status === "completed").length,
  };

  const filtered = local.filter(r => {
    const mf = filter === "all" || r.status === filter;
    const ms = !search || [r.client, r.car, r.plate, r.reference].some(v => v.toLowerCase().includes(search.toLowerCase()));
    return mf && ms;
  });

  return (
    <div className="px-6 sm:px-8 py-6 space-y-4">

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map(f => {
            const active = filter === f.id;
            const count  = counts[f.id] ?? 0;
            const isAlert = f.id === "overdue" && count > 0 && !active;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                  active ? "bg-[#1a2332] text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}>
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center font-bold ${
                  active       ? "bg-white/20 text-white"   :
                  isAlert      ? "bg-red-100 text-red-600"  :
                  "bg-slate-100 text-slate-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <span className="text-[12px] text-slate-400 font-medium">
          {filtered.length} rental{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Reference", "Client", "Vehicle", "Period", "Total", "Deposit", "Status", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left">
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <Search className="h-5 w-5 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-slate-500">No rentals found</p>
                        <p className="text-[12.5px] text-slate-400 mt-1">Try changing filters or search terms.</p>
                      </div>
                      {(filter !== "all" || search) && (
                        <button
                          onClick={() => setFilter("all")}
                          className="h-8 px-4 bg-[#1a2332] text-white rounded-xl text-[12px] font-semibold hover:bg-[#243044] transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : filtered.map(r => {
                const isOverdue = r.status === "overdue";
                return (
                  <tr key={r.id}
                    onClick={() => setSelected(r)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors group ${isOverdue ? "bg-red-50/30" : ""}`}>
                    <td className="px-5 py-4">
                      <p className="text-[12px] font-mono font-semibold text-slate-600">{r.reference}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{SOURCE_LABEL[r.source]}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-[11px] font-bold text-slate-500">{r.client.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-slate-800 leading-tight">{r.client}</p>
                          <p className="text-[11.5px] text-slate-400 mt-0.5">{r.clientPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-slate-700">{r.car}</p>
                      <p className="text-[11.5px] font-mono text-slate-400 mt-0.5">{r.plate}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-[12.5px] font-medium text-slate-700">{fmtShort(r.startDate)}</p>
                      <p className={`text-[11.5px] mt-0.5 font-medium ${isOverdue ? "text-red-500" : "text-slate-400"}`}>
                        → {fmtShort(r.endDate)}{isOverdue ? " ⚠" : ""}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-bold text-slate-800">${r.totalPrice}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[12.5px] text-slate-600">${r.deposit}</p>
                    </td>
                    <td className="px-5 py-4"><Badge s={r.status} /></td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelected(r)} title="View details"
                          className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {(r.status === "active" || r.status === "overdue") && (
                          <button onClick={() => markReturned(r.id)} title="Mark returned"
                            className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button title="Extend rental"
                          className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-100 transition-colors">
                          <CalendarPlus className="h-3.5 w-3.5" />
                        </button>
                        <button title="Print agreement"
                          className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <span className="text-[11.5px] text-slate-400 font-medium">Showing {filtered.length} of {local.length} rentals</span>
        </div>
      </div>

      {selected && (
        <RentalDrawer
          rental={local.find(r => r.id === selected.id) ?? selected}
          onClose={() => setSelected(null)}
          onReturn={markReturned}
        />
      )}
    </div>
  );
}
