import { useState } from "react";
import { RentalFilters } from "./Operations";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Eye, CheckCircle2, Printer, CalendarPlus, X } from "lucide-react";
import { DashboardRental, RentalStatus } from "@/data/dashboardData";
import { useRentals, updateRental, addRental, useT } from "@/data/localStore";
import { RentalCreationModal } from "./RentalCreationModal";

const STATUS_STYLE: Record<RentalStatus, { cls: string; dot: string }> = {
  active:    { cls: "bg-emerald-50 text-emerald-700 border border-emerald-100", dot: "bg-emerald-500" },
  reserved:  { cls: "bg-indigo-50 text-indigo-700 border border-indigo-100",   dot: "bg-indigo-500"  },
  overdue:   { cls: "bg-red-50 text-red-700 border border-red-100",            dot: "bg-red-500"     },
  completed: { cls: "bg-slate-100 text-slate-500 border border-slate-200",     dot: "bg-slate-400"   },
};

function Badge({ s }: { s: RentalStatus }) {
  const t = useT();
  const { cls, dot } = STATUS_STYLE[s];
  const labelKey = s === "active" ? "status.active" : s === "reserved" ? "status.reserved" : s === "overdue" ? "status.overdue" : "status.completed";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {t(labelKey as any)}
    </span>
  );
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function DetailDrawer({ rental, onClose, onReturn }: {
  rental: DashboardRental;
  onClose: () => void;
  onReturn: (id: string) => void;
}) {
  const t = useT();
  const isOverdue = rental.status === "overdue";
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }} onClick={onClose}
      />
      <motion.aside
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl flex flex-col"
        initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className={`flex items-start justify-between px-7 py-6 border-b flex-shrink-0 ${isOverdue ? "bg-red-50 border-red-100" : "border-slate-100"}`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge s={rental.status} />
              <span className="text-[11px] text-slate-400 bg-white/80 border border-slate-200 px-2.5 py-1 rounded-full font-medium">{t("booking.source.walkin")}</span>
            </div>
            <h3 className="text-[18px] font-bold text-[#1a2332] font-mono">{rental.reference}</h3>
            <p className="text-[12px] text-slate-500 mt-1 font-medium">{rental.client}</p>
            {isOverdue && (
              <p className="text-[11.5px] text-red-600 font-semibold mt-1.5">⚠ {t("status.overdue")}</p>
            )}
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-all duration-200 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{t("drawer.client")}</p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl divide-y divide-slate-100">
              {[
                { label: t("form.name"),     value: rental.client        },
                { label: t("table.phone"),   value: rental.clientPhone   },
                { label: t("drawer.license"), value: rental.driverLicense },
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
            <div className="bg-slate-50 border border-slate-100 rounded-2xl divide-y divide-slate-100">
              {[
                { label: t("table.vehicle"),         value: `${rental.car} (${rental.plate})` },
                { label: t("form.pickupDate"),       value: fmt(rental.startDate)             },
                { label: t("form.returnDate"),       value: fmt(rental.endDate)               },
                { label: t("form.pickupLocation"),   value: rental.pickupLocation             },
                ...(rental.returnLocation ? [{ label: t("form.returnLocation"), value: rental.returnLocation }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-4 py-3">
                  <span className="text-[11.5px] text-slate-400 font-medium">{label}</span>
                  <span className="text-[12.5px] text-slate-700 font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{t("table.total")}</p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl divide-y divide-slate-100">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[11.5px] text-slate-400 font-medium">{t("table.total")}</span>
                <span className="text-[15px] text-[#1a2332] font-bold">${rental.totalPrice}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-[11.5px] text-slate-400 font-medium">{t("table.deposit")}</span>
                <span className="text-[12.5px] text-slate-700 font-semibold">${rental.deposit}</span>
              </div>
            </div>
          </section>

          {rental.notes && (
            <section>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{t("form.notes")}</p>
              <p className="text-[13px] text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">{rental.notes}</p>
            </section>
          )}
        </div>

        <div className="border-t border-slate-100 px-7 py-5 flex flex-wrap gap-2.5 flex-shrink-0 bg-slate-50/60">
          {(rental.status === "active" || rental.status === "overdue") && (
            <button onClick={() => { onReturn(rental.id); onClose(); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[12.5px] font-semibold hover:bg-emerald-100 transition-all duration-200 cursor-pointer">
              <CheckCircle2 className="h-4 w-4" /> {t("action.return")}
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-[12.5px] font-semibold hover:bg-slate-200 transition-all duration-200 cursor-pointer">
            <Printer className="h-4 w-4" /> {t("action.print")}
          </button>
          <button onClick={onClose} className="ml-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[12.5px] font-semibold hover:bg-slate-50 transition-all duration-200 cursor-pointer">
            {t("action.close")}
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

export function OfflineRentals({ search = "", filters }: { search?: string; filters?: RentalFilters }) {
  const t = useT();
  const allRentals = useRentals();
  const local      = allRentals.filter(r => r.source === "walk-in");

  const [showModal, setShowModal] = useState(false);
  const [selected,  setSelected]  = useState<DashboardRental | null>(null);
  const [toastMsg,  setToastMsg]  = useState<string | null>(null);

  const markReturned = (id: string) => updateRental(id, { status: "completed" as RentalStatus });

  const filtered = local.filter(r => {
    const ms   = !search || [r.client, r.car, r.plate, r.reference].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const fsrc = !filters || filters.source === "all" || filters.source === "walk-in";
    const fFrom = !filters?.dateFrom || r.startDate >= filters.dateFrom;
    const fTo   = !filters?.dateTo   || r.startDate <= filters.dateTo;
    const fLoc  = !filters || filters.location === "all" || r.pickupLocation === filters.location;
    return ms && fsrc && fFrom && fTo && fLoc;
  });

  const TABLE_HEADERS = [
    t("table.reference"), t("table.client"), t("table.vehicle"),
    t("table.dates"), t("table.total"), t("table.deposit"),
    t("table.status"), t("table.actions"),
  ];

  return (
    <div className="px-6 sm:px-8 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-slate-500">
          {local.length} · <span className="text-emerald-600">{local.filter(r => r.status === "active").length} {t("status.active").toLowerCase()}</span>
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 h-10 px-5 bg-[#1a2332] text-white rounded-xl text-[13px] font-semibold hover:bg-[#243044] shadow-sm transition-all duration-200 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> {t("action.newWalkIn")}
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {TABLE_HEADERS.map(h => (
                  <th key={h} className="px-5 py-3.5 text-left">
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <p className="text-[14px] text-slate-400 font-medium">{t("empty.noRentals")}</p>
                  </td>
                </tr>
              )}
              {filtered.map(r => {
                const isOverdue = r.status === "overdue";
                return (
                  <tr key={r.id}
                    onClick={() => setSelected(r)}
                    className={`hover:bg-slate-50 cursor-pointer transition-all duration-150 group ${isOverdue ? "bg-red-50/20" : ""}`}>
                    <td className="px-5 py-4">
                      <p className="text-[12px] font-mono font-semibold text-slate-600">{r.reference}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-slate-800">{r.client}</p>
                      <p className="text-[11.5px] text-slate-400 mt-0.5">{r.clientPhone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-slate-700">{r.car}</p>
                      <p className="text-[11.5px] font-mono text-slate-400 mt-0.5">{r.plate}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-[12.5px] font-medium text-slate-700">{fmt(r.startDate)}</p>
                      <p className={`text-[11.5px] mt-0.5 font-medium ${isOverdue ? "text-red-500" : "text-slate-400"}`}>
                        → {fmt(r.endDate)}{isOverdue ? " ⚠" : ""}
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
                        <button onClick={() => setSelected(r)}
                          className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all duration-200 cursor-pointer">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {(r.status === "active" || r.status === "overdue") && (
                          <button onClick={() => markReturned(r.id)}
                            className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-all duration-200 cursor-pointer">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-100 transition-all duration-200 cursor-pointer">
                          <CalendarPlus className="h-3.5 w-3.5" />
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
          <span className="text-[11.5px] text-slate-400 font-medium">{filtered.length} / {local.length}</span>
        </div>
      </div>

      {selected && (
        <DetailDrawer
          rental={allRentals.find(r => r.id === selected.id) ?? selected}
          onClose={() => setSelected(null)}
          onReturn={markReturned}
        />
      )}

      {showModal && (
        <RentalCreationModal
          onClose={() => setShowModal(false)}
          onCreated={rental => {
            addRental(rental);
            setShowModal(false);
            setToastMsg(`${t("action.newWalkIn")} — ${rental.reference}`);
          }}
        />
      )}

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed bottom-6 right-6 z-[70] flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <p className="text-[13.5px] font-semibold">{toastMsg}</p>
            <button onClick={() => setToastMsg(null)} className="ml-2 opacity-70 hover:opacity-100 cursor-pointer transition-opacity">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
