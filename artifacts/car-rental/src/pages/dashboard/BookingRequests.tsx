import { useState } from "react";
import { X, Phone, Check, Ban, MapPin } from "lucide-react";
import { bookingRequests, BookingRequest, RequestStatus } from "@/data/dashboardData";
import { Booking } from "@/data/mockData";

const STATUS_CFG: Record<RequestStatus, { cls: string; label: string }> = {
  new:       { cls: "bg-blue-50 text-blue-700 border border-blue-100",           label: "New"       },
  contacted: { cls: "bg-amber-50 text-amber-700 border border-amber-100",       label: "Contacted" },
  confirmed: { cls: "bg-emerald-50 text-emerald-700 border border-emerald-100", label: "Confirmed" },
  cancelled: { cls: "bg-slate-100 text-slate-500 border border-slate-200",      label: "Cancelled" },
};
function StatusBadge({ s }: { s: RequestStatus }) {
  const { cls, label } = STATUS_CFG[s];
  return <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${cls}`}>{label}</span>;
}
const SOURCE_LABEL: Record<string, string> = { online: "Website", "walk-in": "Walk-in", phone: "Phone" };
function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

type FilterId = "all" | RequestStatus;
const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" }, { id: "new", label: "New" }, { id: "contacted", label: "Contacted" },
  { id: "confirmed", label: "Confirmed" }, { id: "cancelled", label: "Cancelled" },
];

/* ── Detail drawer ── */
function Drawer({ req, onClose, onStatus }: {
  req: BookingRequest;
  onClose: () => void;
  onStatus: (id: string, s: RequestStatus) => void;
}) {
  const { cls, label } = STATUS_CFG[req.status];
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white shadow-2xl flex flex-col">
        {/* Drawer header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${cls}`}>{label}</span>
              <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{SOURCE_LABEL[req.source]}</span>
            </div>
            <h3 className="text-[15px] font-bold text-[#1a2332]">{req.customer}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Submitted {req.submittedAt}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {([ 
            { title: "Contact", rows: [
              { label: "Full name", value: req.customer },
              { label: "Phone",     value: req.phone    },
              { label: "Email",     value: req.email    },
            ]},
            { title: "Booking Details", rows: [
              { label: "Requested car",   value: req.car                },
              { label: "Pickup date",     value: fmt(req.pickupDate)    },
              { label: "Return date",     value: fmt(req.returnDate)    },
              { label: "Pickup location", value: req.pickupLocation     },
              { label: "Return location", value: req.returnLocation     },
            ]},
          ] as const).map(({ title, rows }) => (
            <section key={title}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{title}</p>
              <div className="divide-y divide-slate-50">
                {rows.map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start py-2.5">
                    <span className="text-[11px] text-slate-400 font-medium flex-shrink-0 mr-4">{label}</span>
                    <span className="text-[12px] text-slate-700 font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {req.notes && (
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Notes</p>
              <p className="text-[12px] text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3.5">{req.notes}</p>
            </section>
          )}
        </div>

        {/* Action bar */}
        <div className="border-t border-slate-100 px-6 py-4 flex flex-wrap gap-2 flex-shrink-0">
          <a href={`tel:${req.phone}`} className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-50 border border-sky-100 text-sky-700 rounded-xl text-[12px] font-semibold hover:bg-sky-100 transition-colors">
            <Phone className="h-3.5 w-3.5" /> Call client
          </a>
          {req.status !== "confirmed" && req.status !== "cancelled" && (
            <button onClick={() => { onStatus(req.id, "confirmed"); onClose(); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[12px] font-semibold hover:bg-emerald-100 transition-colors">
              <Check className="h-3.5 w-3.5" /> Confirm booking
            </button>
          )}
          {req.status !== "cancelled" && (
            <button onClick={() => { onStatus(req.id, "cancelled"); onClose(); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[12px] font-semibold hover:bg-red-100 transition-colors">
              <Ban className="h-3.5 w-3.5" /> Cancel
            </button>
          )}
          <button onClick={onClose} className="ml-auto px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[12px] font-semibold hover:bg-slate-200 transition-colors">
            Close
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── Main ── */
export function BookingRequests({ search = "", bookings }: { search?: string; bookings?: Booking[] }) {
  const [filter, setFilter]       = useState<FilterId>("all");
  const [selected, setSelected]   = useState<BookingRequest | null>(null);
  const [local, setLocal]         = useState(bookingRequests);

  const updateStatus = (id: string, status: RequestStatus) => {
    setLocal(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  const filtered = local.filter(r => {
    const mf = filter === "all" || r.status === filter;
    const ms = !search || [r.customer, r.car, r.email, r.phone].some(v => v.toLowerCase().includes(search.toLowerCase()));
    return mf && ms;
  });

  const counts: Record<string, number> = {
    all: local.length,
    new: local.filter(r => r.status === "new").length,
    contacted: local.filter(r => r.status === "contacted").length,
    confirmed: local.filter(r => r.status === "confirmed").length,
    cancelled: local.filter(r => r.status === "cancelled").length,
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
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                {["Customer", "Requested Car", "Pickup → Return", "Location", "Status", "Source", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-14 text-center text-[13px] text-slate-400">No booking requests match this filter</td></tr>
              )}
              {filtered.map(req => (
                <tr key={req.id} onClick={() => setSelected(req)} className="hover:bg-slate-50/70 cursor-pointer transition-colors group">
                  {/* Customer */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-primary">{req.customer.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-[12.5px] font-semibold text-slate-800 leading-tight">{req.customer}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{req.phone}</p>
                      </div>
                    </div>
                  </td>
                  {/* Car */}
                  <td className="px-4 py-3.5">
                    <p className="text-[12.5px] font-semibold text-slate-700">{req.car}</p>
                  </td>
                  {/* Dates */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="text-[12px] font-medium text-slate-700">{fmt(req.pickupDate)}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">→ {fmt(req.returnDate)}</p>
                  </td>
                  {/* Location */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-start gap-1">
                      <MapPin className="h-3 w-3 text-slate-400 mt-0.5 flex-shrink-0" />
                      <p className="text-[11.5px] text-slate-500 leading-tight max-w-[130px]">{req.pickupLocation}</p>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3.5"><StatusBadge s={req.status} /></td>
                  {/* Source */}
                  <td className="px-4 py-3.5">
                    <span className="text-[11.5px] text-slate-500 font-medium">{SOURCE_LABEL[req.source]}</span>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={`tel:${req.phone}`} title="Call"
                        className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-100 transition-colors">
                        <Phone className="h-3 w-3" />
                      </a>
                      {req.status !== "confirmed" && req.status !== "cancelled" && (
                        <button onClick={() => updateStatus(req.id, "confirmed")} title="Confirm"
                          className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors">
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                      {req.status !== "cancelled" && (
                        <button onClick={() => updateStatus(req.id, "cancelled")} title="Cancel"
                          className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
                          <Ban className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <span className="text-[11px] text-slate-400">Showing {filtered.length} of {local.length} requests</span>
        </div>
      </div>

      {selected && <Drawer req={selected} onClose={() => setSelected(null)} onStatus={updateStatus} />}
    </div>
  );
}
