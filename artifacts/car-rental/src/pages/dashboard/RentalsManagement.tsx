import { useState } from "react";
import { X, CheckCircle2, AlertTriangle } from "lucide-react";
import { rentals as allRentals, DashboardRental, RentalStatus } from "@/data/dashboardData";

const STATUS_CFG: Record<RentalStatus, { cls: string; label: string }> = {
  active:    { cls: "bg-emerald-50 text-emerald-700 border border-emerald-100", label: "Active"    },
  reserved:  { cls: "bg-indigo-50 text-indigo-700 border border-indigo-100",    label: "Reserved"  },
  overdue:   { cls: "bg-red-50 text-red-700 border border-red-100",             label: "Overdue"   },
  completed: { cls: "bg-slate-100 text-slate-500 border border-slate-200",      label: "Completed" },
};
function Badge({ s }: { s: RentalStatus }) {
  const { cls, label } = STATUS_CFG[s];
  return <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${cls}`}>{label}</span>;
}
function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
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

/* ── Detail drawer ── */
function RentalDrawer({ rental, onClose, onReturn }: {
  rental: DashboardRental;
  onClose: () => void;
  onReturn: (id: string) => void;
}) {
  const { cls, label } = STATUS_CFG[rental.status];
  const isOverdue = rental.status === "overdue";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className={`flex items-start justify-between px-6 py-5 border-b flex-shrink-0 ${isOverdue ? "bg-red-50 border-red-100" : "border-slate-100"}`}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${cls}`}>{label}</span>
              <span className="text-[11px] text-slate-400 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">{SOURCE_LABEL[rental.source]}</span>
            </div>
            <h3 className="text-[15px] font-bold text-[#1a2332] font-mono">{rental.reference}</h3>
            {isOverdue && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <AlertTriangle className="h-3 w-3 text-red-500" />
                <span className="text-[11px] text-red-600 font-semibold">Vehicle overdue — contact client immediately</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {([
            { title: "Client Details", rows: [
              { label: "Name",    value: rental.client       },
              { label: "Phone",   value: rental.clientPhone  },
              { label: "License", value: rental.driverLicense },
            ]},
            { title: "Vehicle", rows: [
              { label: "Car",   value: rental.car   },
              { label: "Plate", value: rental.plate },
            ]},
            { title: "Rental Period", rows: [
              { label: "Start date",       value: fmt(rental.startDate)    },
              { label: "End date",         value: fmt(rental.endDate)      },
              { label: "Pickup location",  value: rental.pickupLocation    },
            ]},
            { title: "Payment", rows: [
              { label: "Total price", value: `$${rental.totalPrice}` },
              { label: "Deposit",     value: `$${rental.deposit}`    },
            ]},
          ] as const).map(({ title, rows }) => (
            <section key={title}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{title}</p>
              <div className="divide-y divide-slate-50">
                {rows.map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2.5">
                    <span className="text-[11px] text-slate-400 font-medium">{label}</span>
                    <span className="text-[12px] text-slate-700 font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Action bar */}
        <div className="border-t border-slate-100 px-6 py-4 flex flex-wrap gap-2 flex-shrink-0">
          {(rental.status === "active" || rental.status === "overdue") && (
            <button onClick={() => { onReturn(rental.id); onClose(); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[12px] font-semibold hover:bg-emerald-100 transition-colors">
              <CheckCircle2 className="h-3.5 w-3.5" /> Mark Returned
            </button>
          )}
          <button onClick={onClose}
            className="ml-auto px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[12px] font-semibold hover:bg-slate-200 transition-colors">
            Close
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── Main ── */
export function RentalsManagement({ search = "" }: { search?: string }) {
  const [filter, setFilter]     = useState<FilterId>("all");
  const [selected, setSelected] = useState<DashboardRental | null>(null);
  const [local, setLocal]       = useState(allRentals);

  const markReturned = (id: string) =>
    setLocal(prev => prev.map(r => r.id === id ? { ...r, status: "completed" as RentalStatus } : r));

  const filtered = local.filter(r => {
    const mf = filter === "all" || r.status === filter;
    const ms = !search || [r.client, r.car, r.plate, r.reference].some(v => v.toLowerCase().includes(search.toLowerCase()));
    return mf && ms;
  });

  const counts: Record<string, number> = {
    all:       local.length,
    active:    local.filter(r => r.status === "active").length,
    reserved:  local.filter(r => r.status === "reserved").length,
    overdue:   local.filter(r => r.status === "overdue").length,
    completed: local.filter(r => r.status === "completed").length,
  };

  return (
    <div className="px-5 sm:px-7 pb-7 space-y-4">

      {/* Filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map(f => {
            const active = filter === f.id;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-semibold transition-all ${
                  active ? "bg-primary text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}>
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${active ? "bg-white/25" : "bg-slate-100 text-slate-400"}`}>
                  {counts[f.id]}
                </span>
              </button>
            );
          })}
        </div>
        <span className="text-[11px] text-slate-400 font-medium">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                {["Reference", "Client", "Vehicle", "Start → End", "Total", "Deposit", "Status", "Source"].map(h => (
                  <th key={h} className="px-4 py-3 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-14 text-center text-[13px] text-slate-400">No rentals match this filter</td></tr>
              )}
              {filtered.map(r => {
                const isOverdue = r.status === "overdue";
                return (
                  <tr key={r.id} onClick={() => setSelected(r)}
                    className={`hover:bg-slate-50/70 cursor-pointer transition-colors group ${isOverdue ? "bg-red-50/30" : ""}`}>
                    <td className="px-4 py-3.5">
                      <p className="text-[12px] font-mono font-semibold text-slate-700">{r.reference}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-slate-500">{r.client.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-[12.5px] font-semibold text-slate-800 leading-tight">{r.client}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{r.clientPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[12.5px] font-semibold text-slate-700">{r.car}</p>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">{r.plate}</p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="text-[12px] font-medium text-slate-700">{fmt(r.startDate)}</p>
                      <p className={`text-[11px] mt-0.5 font-medium ${isOverdue ? "text-red-500" : "text-slate-400"}`}>
                        → {fmt(r.endDate)}{isOverdue ? " ⚠" : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[12.5px] font-bold text-slate-800">${r.totalPrice}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[12px] text-slate-600">${r.deposit}</p>
                    </td>
                    <td className="px-4 py-3.5"><Badge s={r.status} /></td>
                    <td className="px-4 py-3.5">
                      <span className="text-[11.5px] text-slate-500 font-medium">{SOURCE_LABEL[r.source]}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <span className="text-[11px] text-slate-400">Showing {filtered.length} of {local.length} rentals</span>
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
