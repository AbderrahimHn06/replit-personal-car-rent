import { AlertTriangle, Clock, Wrench, ShieldOff, CalendarCheck } from "lucide-react";
import { alerts, AlertItem, AlertSeverity, AlertType } from "@/data/dashboardData";

function getAlertStyle(severity: AlertSeverity) {
  switch (severity) {
    case "high": return "bg-red-50 border-red-200 text-red-800";
    case "medium": return "bg-amber-50 border-amber-200 text-amber-800";
    case "low": return "bg-sky-50 border-sky-200 text-sky-800";
  }
}

function getAlertIcon(type: AlertType) {
  switch (type) {
    case "overdue-rental": return AlertTriangle;
    case "urgent-booking": return CalendarCheck;
    case "returning-today": return Clock;
    case "maintenance": return Wrench;
    case "blocked-client": return ShieldOff;
  }
}

function getSeverityLabel(severity: AlertSeverity) {
  switch (severity) {
    case "high": return { label: "Urgent", cls: "bg-red-100 text-red-700" };
    case "medium": return { label: "Warning", cls: "bg-amber-100 text-amber-700" };
    case "low": return { label: "Info", cls: "bg-sky-100 text-sky-700" };
  }
}

function AlertCard({ alert }: { alert: AlertItem }) {
  const Icon = getAlertIcon(alert.type);
  const { label, cls } = getSeverityLabel(alert.severity);

  return (
    <div className={`border rounded-xl p-4 ${getAlertStyle(alert.severity)}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          alert.severity === "high" ? "bg-red-100" :
          alert.severity === "medium" ? "bg-amber-100" : "bg-sky-100"
        }`}>
          <Icon className={`h-4 w-4 ${
            alert.severity === "high" ? "text-red-600" :
            alert.severity === "medium" ? "text-amber-600" : "text-sky-600"
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="text-xs font-bold">{alert.title}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cls}`}>{label}</span>
          </div>
          <p className="text-xs leading-relaxed opacity-90">{alert.message}</p>
          <p className="text-[11px] opacity-60 mt-1">{alert.time}</p>
        </div>
      </div>
    </div>
  );
}

export function AlertsSection() {
  const high = alerts.filter(a => a.severity === "high");
  const medium = alerts.filter(a => a.severity === "medium");
  const low = alerts.filter(a => a.severity === "low");

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-800">Alerts & Notifications</h2>
        <p className="text-xs text-slate-500 mt-0.5">{alerts.length} active alerts — {high.length} urgent</p>
      </div>

      {/* Summary banner */}
      {high.length > 0 && (
        <div className="bg-red-600 rounded-xl p-4 mb-5 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-white flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-white">{high.length} urgent alert{high.length !== 1 ? "s" : ""} require immediate attention</p>
            <p className="text-xs text-red-200 mt-0.5">Review the items below and take action</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {high.length > 0 && (
          <section>
            <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className="w-1.5 h-4 bg-red-500 rounded-full" /> Urgent
            </h3>
            <div className="space-y-3">
              {high.map(a => <AlertCard key={a.id} alert={a} />)}
            </div>
          </section>
        )}

        {medium.length > 0 && (
          <section>
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className="w-1.5 h-4 bg-amber-400 rounded-full" /> Warnings
            </h3>
            <div className="space-y-3">
              {medium.map(a => <AlertCard key={a.id} alert={a} />)}
            </div>
          </section>
        )}

        {low.length > 0 && (
          <section>
            <h3 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className="w-1.5 h-4 bg-sky-400 rounded-full" /> Information
            </h3>
            <div className="space-y-3">
              {low.map(a => <AlertCard key={a.id} alert={a} />)}
            </div>
          </section>
        )}

        {alerts.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-6 w-6 text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600">No alerts</p>
            <p className="text-xs text-slate-400 mt-1">Everything is running smoothly</p>
          </div>
        )}
      </div>
    </div>
  );
}
