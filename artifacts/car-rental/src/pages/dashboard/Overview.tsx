import { motion } from "framer-motion";
import {
  CalendarCheck, Key, Car, TrendingUp, Clock, AlertTriangle,
  Wrench, Users, UserX, DollarSign, ArrowRight, Activity,
} from "lucide-react";
import { Booking } from "@/data/mockData";
import { kpis, recentActivity, alerts, fleet } from "@/data/dashboardData";

interface Props {
  bookings: Booking[];
  onNavigate: (s: string) => void;
}

function KpiCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType;
  color: string; sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5 font-medium">{label}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

function StatusBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-600 font-medium">{label}</span>
        <span className="text-xs font-bold text-slate-700">{count}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Overview({ bookings, onNavigate }: Props) {
  const totalFleet = fleet.length;
  const urgentAlerts = alerts.filter(a => a.severity === "high");

  const kpiCards = [
    { label: "Total Bookings", value: kpis.totalBookings, icon: CalendarCheck, color: "bg-primary/10 text-primary" },
    { label: "Active Rentals", value: kpis.activeRentals, icon: Key, color: "bg-emerald-50 text-emerald-600" },
    { label: "Available Cars", value: kpis.availableCars, icon: Car, color: "bg-sky-50 text-sky-600" },
    { label: "Monthly Revenue", value: `$${kpis.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-amber-50 text-amber-600", sub: `vs $${kpis.lastMonthRevenue.toLocaleString()} last month` },
    { label: "Pending Requests", value: kpis.pendingRequests, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "Overdue Rentals", value: kpis.overdueRentals, icon: AlertTriangle, color: "bg-red-50 text-red-600" },
    { label: "Maintenance Cars", value: kpis.maintenanceCars, icon: Wrench, color: "bg-orange-50 text-orange-600" },
    { label: "Total Clients", value: kpis.totalClients, icon: Users, color: "bg-indigo-50 text-indigo-600" },
    { label: "Blocked Clients", value: kpis.blockedClients, icon: UserX, color: "bg-slate-100 text-slate-600" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* KPI Grid */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Metrics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
          {kpiCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <KpiCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Row 2: Activity + Alerts + Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-slate-700">Recent Activity</span>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivity.slice(0, 8).map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors">
                <span className="text-base mt-0.5 flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-400 truncate">{item.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Alerts */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-bold text-slate-700">Urgent Alerts</span>
            </div>
            <button
              onClick={() => onNavigate("alerts")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="p-3 space-y-2">
            {urgentAlerts.map((alert) => (
              <div key={alert.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs font-bold text-red-700">{alert.title}</p>
                <p className="text-[11px] text-red-600 mt-0.5 leading-relaxed">{alert.message}</p>
                <p className="text-[10px] text-red-400 mt-1">{alert.time}</p>
              </div>
            ))}
            {urgentAlerts.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-sm">No urgent alerts</div>
            )}
          </div>
        </div>

        {/* Fleet Status */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
            <Car className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-slate-700">Fleet Status</span>
          </div>
          <div className="p-4 space-y-4">
            <StatusBar label="Available" count={kpis.availableCars} total={totalFleet} color="bg-emerald-500" />
            <StatusBar label="Rented" count={kpis.rentedCars} total={totalFleet} color="bg-amber-400" />
            <StatusBar label="Reserved" count={kpis.reservedCars} total={totalFleet} color="bg-indigo-400" />
            <StatusBar label="Maintenance" count={kpis.maintenanceCars} total={totalFleet} color="bg-red-400" />

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Fleet utilization</span>
                <span className="font-bold text-slate-700">
                  {Math.round(((kpis.rentedCars + kpis.reservedCars) / totalFleet) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                <div className="bg-emerald-500 h-full" style={{ width: `${(kpis.availableCars / totalFleet) * 100}%` }} />
                <div className="bg-amber-400 h-full" style={{ width: `${(kpis.rentedCars / totalFleet) * 100}%` }} />
                <div className="bg-indigo-400 h-full" style={{ width: `${(kpis.reservedCars / totalFleet) * 100}%` }} />
                <div className="bg-red-400 h-full" style={{ width: `${(kpis.maintenanceCars / totalFleet) * 100}%` }} />
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {[
                  { label: "Available", color: "bg-emerald-500" },
                  { label: "Rented", color: "bg-amber-400" },
                  { label: "Reserved", color: "bg-indigo-400" },
                  { label: "Maint.", color: "bg-red-400" },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-[10px] text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick nav shortcuts */}
          <div className="border-t border-slate-100 p-3 grid grid-cols-2 gap-2">
            {[
              { label: "New Request", section: "bookings", badge: kpis.pendingRequests },
              { label: "Active Rentals", section: "rentals", badge: kpis.activeRentals },
              { label: "Fleet", section: "fleet" },
              { label: "Walk-in", section: "offline" },
            ].map(({ label, section, badge }) => (
              <button
                key={section}
                onClick={() => onNavigate(section)}
                className="flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-primary/8 rounded-lg text-xs font-medium text-slate-600 hover:text-primary transition-colors border border-slate-200"
              >
                <span>{label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
