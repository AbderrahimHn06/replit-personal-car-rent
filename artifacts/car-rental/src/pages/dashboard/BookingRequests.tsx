import { useState } from "react";
import { RentalFilters } from "./Operations";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Check, Ban, MapPin, Eye, Globe, PhoneCall } from "lucide-react";
import { BookingRequest, RequestStatus } from "@/data/dashboardData";
import { useT, useBookingRequests, updateBookingRequest } from "@/data/localStore";

const STATUS_STYLE: Record<RequestStatus, { cls: string; dot: string }> = {
  new:       { cls: "bg-blue-50 text-blue-700 border border-blue-100",           dot: "bg-blue-500"    },
  contacted: { cls: "bg-amber-50 text-amber-700 border border-amber-100",        dot: "bg-amber-500"   },
  confirmed: { cls: "bg-emerald-50 text-emerald-700 border border-emerald-100",  dot: "bg-emerald-500" },
  cancelled: { cls: "bg-slate-100 text-slate-400 border border-slate-200",       dot: "bg-slate-400"   },
};

function StatusBadge({ s }: { s: RequestStatus }) {
  const t = useT();
  const { cls, dot } = STATUS_STYLE[s];
  const labelKey = s === "new" ? "filter.new" : s === "contacted" ? "filter.contacted" : s === "confirmed" ? "filter.confirmed" : "filter.cancelled";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {t(labelKey as any)}
    </span>
  );
}

const SOURCE_ICON: Record<string, React.ReactNode> = {
  online:    <Globe className="h-3 w-3" />,
  "walk-in": <MapPin className="h-3 w-3" />,
  phone:     <PhoneCall className="h-3 w-3" />,
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

type FilterId = "all" | RequestStatus;

function Drawer({ req, onClose, onStatus }: {
  req: BookingRequest;
  onClose: () => void;
  onStatus: (id: string, s: RequestStatus) => void;
}) {
  const t = useT();

  const SOURCE_LABEL_MAP: Record<string, string> = {
    online:    t("booking.source.website"),
    "walk-in": t("booking.source.walkin"),
    phone:     t("booking.source.phone"),
  };

  const STATUS_STEPS: Record<RequestStatus, { step: string; done: boolean }[]> = {
    new:       [
      { step: t("booking.status.requestReceived"), done: true  },
      { step: t("booking.status.clientContacted"), done: false },
      { step: t("booking.status.bookingConfirmed"), done: false },
    ],
    contacted: [
      { step: t("booking.status.requestReceived"), done: true  },
      { step: t("booking.status.clientContacted"), done: true  },
      { step: t("booking.status.bookingConfirmed"), done: false },
    ],
    confirmed: [
      { step: t("booking.status.requestReceived"), done: true  },
      { step: t("booking.status.clientContacted"), done: true  },
      { step: t("booking.status.bookingConfirmed"), done: true  },
    ],
    cancelled: [
      { step: t("booking.status.requestReceived"), done: true  },
      { step: t("filter.cancelled"),               done: true  },
    ],
  };

  const history = STATUS_STEPS[req.status];

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <motion.aside initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-7 py-6 border-b border-slate-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge s={req.status} />
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                {SOURCE_ICON[req.source]}
                {SOURCE_LABEL_MAP[req.source]}
              </span>
            </div>
            <h3 className="text-[18px] font-bold text-[#1a2332]">{req.customer}</h3>
            <p className="text-[12px] text-slate-400 mt-1 font-medium">{t("drawer.submitted")} {req.submittedAt}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">{t("drawer.timeline")}</p>
            <div className="flex items-center gap-0">
              {history.map((step, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      step.done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                    }`}>
                      {step.done ? "✓" : i + 1}
                    </div>
                    <p className={`text-[9.5px] font-semibold mt-1.5 text-center max-w-[72px] leading-tight ${step.done ? "text-slate-600" : "text-slate-400"}`}>
                      {step.step}
                    </p>
                  </div>
                  {i < history.length - 1 && (
                    <div className={`flex-1 h-[2px] mb-4 mx-1 ${history[i + 1].done ? "bg-emerald-300" : "bg-slate-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{t("drawer.client")}</p>
            <div className="bg-slate-50 rounded-2xl divide-y divide-slate-100 border border-slate-100">
              {[
                { label: t("form.name"),  value: req.customer },
                { label: t("table.phone"), value: req.phone   },
                { label: t("form.email"), value: req.email    },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-4 py-3">
                  <span className="text-[11.5px] text-slate-400 font-medium">{label}</span>
                  <span className="text-[12.5px] text-slate-700 font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{t("drawer.rentalDetails")}</p>
            <div className="bg-slate-50 rounded-2xl divide-y divide-slate-100 border border-slate-100">
              {[
                { label: t("table.vehicle"),           value: req.car              },
                { label: t("form.pickupDate"),         value: fmt(req.pickupDate)  },
                { label: t("form.returnDate"),         value: fmt(req.returnDate)  },
                { label: t("form.pickupLocation"),     value: req.pickupLocation   },
                { label: t("form.returnLocation"),     value: req.returnLocation   },
                { label: t("table.source"),            value: SOURCE_LABEL_MAP[req.source] },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-4 py-3">
                  <span className="text-[11.5px] text-slate-400 font-medium">{label}</span>
                  <span className="text-[12.5px] text-slate-700 font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {req.notes && (
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{t("form.notes")}</p>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <p className="text-[12.5px] text-amber-800 leading-relaxed">{req.notes}</p>
              </div>
            </section>
          )}
        </div>

        {/* Action bar */}
        <div className="border-t border-slate-100 px-7 py-5 flex flex-wrap gap-2.5 flex-shrink-0 bg-slate-50/60">
          <a href={`tel:${req.phone}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 border border-sky-100 text-sky-700 rounded-xl text-[12.5px] font-semibold hover:bg-sky-100 transition-colors">
            <Phone className="h-4 w-4" /> {t("action.callClient")}
          </a>
          {req.status !== "confirmed" && req.status !== "cancelled" && (
            <>
              {req.status === "new" && (
                <button onClick={() => onStatus(req.id, "contacted")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-[12.5px] font-semibold hover:bg-amber-100 transition-colors">
                  {t("filter.contacted")}
                </button>
              )}
              <button onClick={() => { onStatus(req.id, "confirmed"); onClose(); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[12.5px] font-semibold hover:bg-emerald-100 transition-colors">
                <Check className="h-4 w-4" /> {t("action.confirm")}
              </button>
            </>
          )}
          {req.status !== "cancelled" && (
            <button onClick={() => { onStatus(req.id, "cancelled"); onClose(); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[12.5px] font-semibold hover:bg-red-100 transition-colors">
              <Ban className="h-4 w-4" /> {t("action.cancel")}
            </button>
          )}
          <button onClick={onClose} className="ml-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[12.5px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
            {t("action.close")}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export function BookingRequests({ search = "", filters }: { search?: string; filters?: RentalFilters }) {
  const t = useT();
  const [filter, setFilter]     = useState<FilterId>("all");
  const [selected, setSelected] = useState<BookingRequest | null>(null);
  const local = useBookingRequests();

  const FILTERS: { id: FilterId; labelKey: string }[] = [
    { id: "all",       labelKey: "filter.all"       },
    { id: "new",       labelKey: "filter.new"       },
    { id: "contacted", labelKey: "filter.contacted" },
    { id: "confirmed", labelKey: "filter.confirmed" },
    { id: "cancelled", labelKey: "filter.cancelled" },
  ];

  const SOURCE_LABEL_MAP: Record<string, string> = {
    online:    t("booking.source.website"),
    "walk-in": t("booking.source.walkin"),
    phone:     t("booking.source.phone"),
  };

  const updateStatus = (id: string, status: RequestStatus) => {
    updateBookingRequest(id, { status });
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  const filtered = local.filter(r => {
    const mf = filter === "all" || r.status === filter;
    const ms = !search || [r.customer, r.car, r.email, r.phone].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const fsrc = !filters || filters.source === "all" || r.source === filters.source;
    const fFrom = !filters?.dateFrom || r.pickupDate >= filters.dateFrom;
    const fTo   = !filters?.dateTo   || r.pickupDate <= filters.dateTo;
    const fLoc  = !filters || filters.location === "all" || r.pickupLocation === filters.location;
    return mf && ms && fsrc && fFrom && fTo && fLoc;
  });

  const counts: Record<string, number> = {
    all:       local.length,
    new:       local.filter(r => r.status === "new").length,
    contacted: local.filter(r => r.status === "contacted").length,
    confirmed: local.filter(r => r.status === "confirmed").length,
    cancelled: local.filter(r => r.status === "cancelled").length,
  };

  const TABLE_HEADERS = [
    t("table.client"), t("table.vehicle"), t("table.dates"),
    t("table.location"), t("table.status"), t("table.source"), t("table.actions"),
  ];

  return (
    <div className="px-6 sm:px-8 py-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map(f => {
            const active = filter === f.id;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} onMouseDown={e => e.preventDefault()}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                  active ? "bg-[#1a2332] text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}>
                {t(f.labelKey as any)}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center font-bold ${
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {counts[f.id]}
                </span>
              </button>
            );
          })}
        </div>
        <span className="text-[12px] text-slate-400 font-medium">{filtered.length}</span>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {TABLE_HEADERS.map(h => (
                  <th key={h} className="px-5 py-3.5 text-left">
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <AnimatePresence mode="wait">
            <motion.tbody
              key={filter + search}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="divide-y divide-slate-100"
            >
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <p className="text-[14px] text-slate-400 font-medium">{t("empty.noBookings")}</p>
                  </td>
                </tr>
              )}
              {filtered.map(req => (
                <tr key={req.id}
                  onClick={() => setSelected(req)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-bold text-violet-600">{req.customer.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800 leading-tight">{req.customer}</p>
                        <p className="text-[11.5px] text-slate-400 mt-0.5">{req.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[13px] font-semibold text-slate-700">{req.car}</p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-[12.5px] font-medium text-slate-700">{fmt(req.pickupDate)}</p>
                    <p className="text-[11.5px] text-slate-400 mt-0.5">→ {fmt(req.returnDate)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <p className="text-[12px] text-slate-500 leading-tight max-w-[130px]">{req.pickupLocation}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge s={req.status} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                      {SOURCE_ICON[req.source]}
                      {SOURCE_LABEL_MAP[req.source]}
                    </span>
                  </td>
                  <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setSelected(req)}
                        className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <a href={`tel:${req.phone}`}
                        className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-100 transition-colors">
                        <Phone className="h-3.5 w-3.5" />
                      </a>
                      {req.status !== "confirmed" && req.status !== "cancelled" && (
                        <button onClick={() => updateStatus(req.id, "confirmed")}
                          className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors">
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {req.status !== "cancelled" && (
                        <button onClick={() => updateStatus(req.id, "cancelled")}
                          className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
                          <Ban className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </motion.tbody>
            </AnimatePresence>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[11.5px] text-slate-400 font-medium">{filtered.length} / {local.length}</span>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <Drawer
            key="booking-drawer"
            req={local.find(r => r.id === selected.id) ?? selected}
            onClose={() => setSelected(null)}
            onStatus={updateStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
