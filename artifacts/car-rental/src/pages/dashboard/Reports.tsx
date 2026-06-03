import { TrendingUp, TrendingDown, Car, Users, DollarSign, BarChart3 } from "lucide-react";
import { kpis, fleet, rentals, clients } from "@/data/dashboardData";
import { useT } from "@/data/localStore";

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-600 w-8 text-right">{pct}%</span>
    </div>
  );
}

function MetricCard({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; trend?: { value: string; up: boolean };
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend.up ? "text-emerald-600" : "text-red-500"}`}>
            {trend.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {trend.value}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs font-medium text-slate-500 mt-0.5">{label}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

export function Reports() {
  const t = useT();
  const totalRentals     = rentals.length;
  const completedRentals = rentals.filter(r => r.status === "completed").length;
  const totalRevenue     = rentals.reduce((sum, r) => sum + r.totalPrice, 0);
  const onlineClients    = clients.filter(c => c.source === "online").length;
  const walkinClients    = clients.filter(c => c.source === "walk-in").length;
  const revenueGrowth    = Math.round(((kpis.monthlyRevenue - kpis.lastMonthRevenue) / kpis.lastMonthRevenue) * 100);

  const durationBreakdown = [
    { label: "1–3 j", count: 3 },
    { label: "4–7 j", count: 4 },
    { label: "8–14 j", count: 2 },
    { label: "15+ j", count: 1 },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-800">{t("reports.title")}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{t("reports.sub")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label={t("reports.monthly")}
          value={`$${kpis.monthlyRevenue.toLocaleString()}`}
          sub={`${t("overview.lastMonth")}: $${kpis.lastMonthRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-amber-50 text-amber-600"
          trend={{ value: `+${revenueGrowth}%`, up: true }}
        />
        <MetricCard
          label={t("reports.totalBookings")}
          value={kpis.totalBookings}
          sub={`${kpis.confirmedBookings} ${t("status.confirmed").toLowerCase()}`}
          icon={BarChart3}
          color="bg-primary/10 text-primary"
          trend={{ value: "+8%", up: true }}
        />
        <MetricCard
          label={t("reports.fleetUtilization")}
          value={`${Math.round(((kpis.rentedCars + kpis.reservedCars) / fleet.length) * 100)}%`}
          sub={`${kpis.availableCars} ${t("status.available").toLowerCase()}`}
          icon={Car}
          color="bg-sky-50 text-sky-600"
        />
        <MetricCard
          label={t("reports.totalClients")}
          value={kpis.totalClients}
          sub={`${onlineClients} online, ${walkinClients} ${t("booking.source.walkin").toLowerCase()}`}
          icon={Users}
          color="bg-indigo-50 text-indigo-600"
          trend={{ value: "+2", up: true }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {/* Bookings by source */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t("reports.bookingsBySource")}</h3>
          <div className="space-y-3">
            {[
              { label: t("booking.source.website"), count: 14, total: 23, color: "bg-indigo-500" },
              { label: t("booking.source.phone"),   count: 5,  total: 23, color: "bg-purple-400" },
              { label: t("booking.source.walkin"),  count: 4,  total: 23, color: "bg-teal-400"   },
            ].map(({ label, count, total, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-slate-600">{label}</span>
                  <span className="text-xs font-bold text-slate-700">{count}</span>
                </div>
                <ProgressBar value={count} max={total} color={color} />
              </div>
            ))}
          </div>
        </div>

        {/* Fleet utilization */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t("reports.fleetUtilization")}</h3>
          <div className="space-y-3">
            {[
              { labelKey: "fleet.available",   count: kpis.availableCars,   color: "bg-emerald-500" },
              { labelKey: "fleet.rented",      count: kpis.rentedCars,      color: "bg-amber-400" },
              { labelKey: "fleet.reserved",    count: kpis.reservedCars,    color: "bg-indigo-400" },
              { labelKey: "fleet.maintenance", count: kpis.maintenanceCars, color: "bg-red-400" },
            ].map(({ labelKey, count, color }) => (
              <div key={labelKey}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-slate-600">{t(labelKey as any)}</span>
                  <span className="text-xs font-bold text-slate-700">{count} / {fleet.length}</span>
                </div>
                <ProgressBar value={count} max={fleet.length} color={color} />
              </div>
            ))}
          </div>
        </div>

        {/* Rental duration */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t("reports.rentalDuration")}</h3>
          <div className="space-y-3">
            {durationBreakdown.map(({ label, count }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-slate-600">{label}</span>
                  <span className="text-xs font-bold text-slate-700">{count} {t("nav.rentals").toLowerCase()}</span>
                </div>
                <ProgressBar value={count} max={totalRentals} color="bg-primary" />
              </div>
            ))}
          </div>
        </div>

        {/* Revenue breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t("kpi.monthlyRevenue")}</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-xs text-slate-500">{t("overview.thisMonth")}</span>
              <span className="text-sm font-bold text-accent">${kpis.monthlyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-xs text-slate-500">{t("overview.lastMonth")}</span>
              <span className="text-sm font-bold text-slate-700">${kpis.lastMonthRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-xs text-slate-500">{t("kpi.revenueGrowth")}</span>
              <span className="text-sm font-bold text-emerald-600">+{revenueGrowth}%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-xs text-slate-500">{t("kpi.totalBookings")}</span>
              <span className="text-sm font-bold text-slate-700">${totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-xs text-slate-500">Avg.</span>
              <span className="text-sm font-bold text-slate-700">${Math.round(totalRevenue / totalRentals)}</span>
            </div>
          </div>
        </div>

        {/* Client stats */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t("kpi.totalClients")}</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-600">{t("booking.source.website")}</span>
                <span className="text-xs font-bold text-slate-700">{onlineClients}</span>
              </div>
              <ProgressBar value={onlineClients} max={clients.length} color="bg-indigo-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-600">{t("booking.source.walkin")}</span>
                <span className="text-xs font-bold text-slate-700">{walkinClients}</span>
              </div>
              <ProgressBar value={walkinClients} max={clients.length} color="bg-teal-500" />
            </div>
            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">{t("kpi.blockedClients")}</span>
                <span className="font-bold text-red-500">{kpis.blockedClients}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">{t("kpi.activeRentals")}</span>
                <span className="font-bold text-slate-700">{kpis.activeRentals}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t("form.status")}</h3>
          <div className="space-y-3">
            {[
              { labelKey: "status.confirmed",    count: kpis.confirmedBookings, color: "bg-emerald-500" },
              { labelKey: "kpi.pendingRequests", count: kpis.pendingRequests,   color: "bg-amber-400" },
              { labelKey: "kpi.activeRentals",   count: kpis.activeRentals,     color: "bg-sky-500" },
              { labelKey: "status.overdue",      count: kpis.overdueRentals,    color: "bg-red-400" },
            ].map(({ labelKey, count, color }) => (
              <div key={labelKey}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-slate-600">{t(labelKey as any)}</span>
                  <span className="text-xs font-bold text-slate-700">{count}</span>
                </div>
                <ProgressBar value={count} max={kpis.totalBookings} color={color} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
