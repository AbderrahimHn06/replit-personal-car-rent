import { useState } from "react";
import { AlertTriangle, Clock, Wrench, ShieldOff, CalendarCheck, Phone, Car, CheckCircle2, X } from "lucide-react";
import { AlertItem, AlertSeverity, AlertType } from "@/data/dashboardData";
import { useAlerts, removeAlert, dismissAllAlerts, useT } from "@/data/localStore";

function getAlertStyle(severity: AlertSeverity) {
  switch (severity) {
    case "high":   return { card: "bg-red-50 border-red-200",    icon: "bg-red-100 text-red-600",    badge: "bg-red-100 text-red-700" };
    case "medium": return { card: "bg-amber-50 border-amber-200", icon: "bg-amber-100 text-amber-600", badge: "bg-amber-100 text-amber-700" };
    case "low":    return { card: "bg-sky-50 border-sky-200",    icon: "bg-sky-100 text-sky-600",    badge: "bg-sky-100 text-sky-700" };
  }
}

function getAlertIcon(type: AlertType) {
  switch (type) {
    case "overdue-rental":  return AlertTriangle;
    case "urgent-booking":  return CalendarCheck;
    case "returning-today": return Clock;
    case "maintenance":     return Wrench;
    case "blocked-client":  return ShieldOff;
  }
}

function AlertCard({ alert, onDismiss }: { alert: AlertItem; onDismiss: (id: string) => void }) {
  const t = useT();
  const Icon = getAlertIcon(alert.type);
  const style = getAlertStyle(alert.severity);

  const severityLabel =
    alert.severity === "high" ? t("severity.urgent") :
    alert.severity === "medium" ? t("severity.warning") :
    t("severity.info");

  const actions = (() => {
    switch (alert.type) {
      case "overdue-rental":
        return [
          { label: t("action.callClient"), icon: Phone, cls: "text-red-700 border-red-200 bg-red-50 hover:bg-red-100" },
          { label: t("action.viewRental"), icon: Car,   cls: "text-red-700 border-red-200 bg-red-50 hover:bg-red-100" },
        ];
      case "urgent-booking":
        return [{ label: t("action.review"), icon: CalendarCheck, cls: "text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100" }];
      case "returning-today":
        return [{ label: t("action.checkIn"), icon: CheckCircle2, cls: "text-sky-700 border-sky-200 bg-sky-50 hover:bg-sky-100" }];
      case "maintenance":
        return [{ label: t("action.viewService"), icon: Wrench, cls: "text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100" }];
      case "blocked-client":
        return [{ label: t("action.viewClient"), icon: ShieldOff, cls: "text-sky-700 border-sky-200 bg-sky-50 hover:bg-sky-100" }];
      default:
        return [];
    }
  })();

  return (
    <div className={`border rounded-2xl p-4 ${style.card} transition-all`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${style.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[13px] font-bold text-slate-800">{alert.title}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${style.badge}`}>{severityLabel}</span>
            </div>
            <button
              onClick={() => onDismiss(alert.id)}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:bg-black/10 transition-colors flex-shrink-0"
              title={t("action.dismiss")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-[12.5px] text-slate-700 leading-relaxed">{alert.message}</p>
          <p className="text-[11px] text-slate-400 mt-1">{alert.time}</p>
          {actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {actions.map(({ label, icon: AIcon, cls }) => (
                <button key={label} className={`flex items-center gap-1.5 h-7 px-3 rounded-lg border text-[11.5px] font-semibold transition-colors cursor-pointer ${cls}`}>
                  <AIcon className="h-3 w-3" /> {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AlertsSection() {
  const t = useT();
  const items = useAlerts();

  const dismiss = (id: string) => removeAlert(id);

  const high   = items.filter(a => a.severity === "high");
  const medium = items.filter(a => a.severity === "medium");
  const low    = items.filter(a => a.severity === "low");

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[18px] font-bold text-[#1a2332]">{t("alerts.title")}</h2>
          <p className="text-[12.5px] text-slate-400 mt-0.5">
            {items.length > 0
              ? `${items.length} ${t("alerts.active")} · ${high.length} ${t("alerts.urgent")}`
              : t("alerts.allClear")}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => dismissAllAlerts()}
            className="flex items-center gap-1.5 h-8 px-3.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-[12px] font-semibold hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> {t("action.dismissAll")}
          </button>
        )}
      </div>

      {items.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-14 text-center shadow-sm">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <p className="text-[15px] font-semibold text-slate-600">{t("alerts.noAlerts")}</p>
          <p className="text-[12.5px] text-slate-400 mt-1">{t("alerts.runningSmoothly")}</p>
        </div>
      )}

      <div className="space-y-6">
        {high.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 bg-red-500 rounded-full" />
              <h3 className="text-[11px] font-bold text-red-600 uppercase tracking-widest">{t("alerts.urgentGroup")} · {high.length}</h3>
            </div>
            <div className="space-y-3">
              {high.map(a => <AlertCard key={a.id} alert={a} onDismiss={dismiss} />)}
            </div>
          </section>
        )}

        {medium.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 bg-amber-400 rounded-full" />
              <h3 className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">{t("alerts.warningsGroup")} · {medium.length}</h3>
            </div>
            <div className="space-y-3">
              {medium.map(a => <AlertCard key={a.id} alert={a} onDismiss={dismiss} />)}
            </div>
          </section>
        )}

        {low.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 bg-sky-400 rounded-full" />
              <h3 className="text-[11px] font-bold text-sky-600 uppercase tracking-widest">{t("alerts.infoGroup")} · {low.length}</h3>
            </div>
            <div className="space-y-3">
              {low.map(a => <AlertCard key={a.id} alert={a} onDismiss={dismiss} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
