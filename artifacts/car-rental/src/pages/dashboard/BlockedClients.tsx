import { useState } from "react";
import { X, ShieldOff, AlertTriangle, RotateCcw } from "lucide-react";
import { BlockedClient } from "@/data/dashboardData";
import { useBlockedClients, removeBlockedClient, useT } from "@/data/localStore";

export function BlockedClientsSection() {
  const t = useT();
  const clients = useBlockedClients();
  const [selected, setSelected] = useState<BlockedClient | null>(null);

  const unblock = (id: string) => {
    removeBlockedClient(id);
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-800">{t("section.blocked.title")}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{clients.length} — {t("kpi.sub.restrictedFromRenting")}</p>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <ShieldOff className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">{t("empty.noClients")}</p>
          <p className="text-xs text-slate-400 mt-1">{t("alerts.runningSmoothly")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map(c => (
            <div key={c.id} className="bg-white border border-red-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <ShieldOff className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-800">{c.name}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[11px] font-semibold border border-red-200">
                        {t("status.overdue")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{c.phone}</p>
                    <div className="flex items-start gap-1.5 mt-2">
                      <AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 leading-relaxed">{c.reason}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                      <span>{c.blockedDate}</span>
                      <span>·</span>
                      <span>{c.totalRentals} {t("nav.rentals").toLowerCase()}</span>
                      <span>·</span>
                      <span className="font-mono">{c.relatedRental}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setSelected(c)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors text-xs font-medium"
                  >
                    <X className="h-3.5 w-3.5 rotate-45" />
                  </button>
                  <button
                    onClick={() => unblock(c.id)}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-xs font-semibold transition-colors border border-slate-200 hover:border-emerald-200"
                  >
                    <RotateCcw className="h-3 w-3" /> {t("action.unblock")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-2">{t("action.block")}</p>
                <p className="text-sm text-red-800 leading-relaxed">{selected.reason}</p>
              </div>
              {[
                { label: t("form.name"),     value: selected.name          },
                { label: t("table.phone"),   value: selected.phone         },
                { label: selected.blockedDate, value: selected.blockedDate  },
                { label: t("table.reference"), value: selected.relatedRental },
                { label: t("kpi.totalBookings"), value: `${selected.totalRentals}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-xs font-semibold text-slate-700">{value}</span>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setSelected(null)} className="flex-1 h-9 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                  {t("action.close")}
                </button>
                <button
                  onClick={() => unblock(selected.id)}
                  className="flex-1 h-9 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> {t("action.unblock")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
