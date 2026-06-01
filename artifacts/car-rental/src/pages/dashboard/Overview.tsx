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

function StatCard({ label, value, icon: Icon, iconBg, iconColor, sub, subUp }: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  sub?: string;
  subUp?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-[#1a2332] leading-none">{value}</p>
      {sub && (
        <p className={`text-[11px] font-medium mt-2 ${
          subUp === undefined ? "text-slate-400" :
          subUp ? "text-emerald-600" : "text-red-500"
        }`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function MiniStatusBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-slate-600 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-slate-800">{count}</span>
          <span className="text-[11px] text-slate-400">{pct}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const STATS = [
  { label: "Total Bookings", value: (k: typeof kpis) => k.totalBookings, icon: CalendarCheck, iconBg: "bg-primary/10", iconColor: "text-primary", sub: (k: typeof kpis) => `${k.confirmedBookings} confirmed this month` },
  { label: "Active Rentals", value: (k: typeof kpis) => k.activeRentals, icon: Key, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", sub: () => "Currently on the road" },
  { label: "Available Cars", value: (k: typeof kpis) => k.availableCars, icon: Car, iconBg: "bg-sky-50", iconColor: "text-sky-600", sub: (k: typeof kpis) => `of ${k.availableCars + k.rentedCars + k.reservedCars + k.maintenanceCars} total vehicles` },
  { label: "Monthly Revenue", value: (k: typeof kpis) => `$${k.monthlyRevenue.toLocaleString()}`, icon: DollarSign, iconBg: "bg-amber-50", iconColor: "text-amber-600", sub: (k: typeof kpis) => `+${Math.round(((k.monthlyRevenue - k.lastMonthRevenue) / k.lastMonthRevenue) * 100)}% vs last month`, subUp: true },
  { label: "Pending Requests", value: (k: typeof kpis) => k.pendingRequests, icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600", sub: () => "Awaiting response" },
  { label: "Overdue Rentals", value: (k: typeof kpis) => k.overdueRentals, icon: AlertTriangle, iconBg: "bg-red-50", iconColor: "text-red-500", sub: () => "Requires immediate follow-up", subUp: false },
  { label: "In Maintenance", value: (k: typeof kpis) => k.maintenanceCars, icon: Wrench, iconBg: "bg-orange-50", iconColor: "text-orange-500", sub: () => "Temporarily out of service" },
  { label: "Total Clients", value: (k: typeof kpis) => k.totalClients, icon: Users, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", sub: (k: typeof kpis) => `${k.blockedClients} blocked` },
];

export function Overview({ bookings, onNavigate }: Props) {
  const totalFleet = fleet.length;
  const urgentAlerts = alerts.filter(a => a.severity === "high");

  return (
    <div className="p-5 sm:p-7 space-y-7">

      {/* KPI Grid */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Key Metrics</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <StatCard
                label={s.label}
                value={s.value(kpis)}
                icon={s.icon}
                iconBg={s.iconBg}
                iconColor={s.iconColor}
                sub={s.sub(kpis)}
                subUp={s.subUp}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom row: Activity + Alerts + Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-[13px] font-bold text-slate-800">Recent Activity</span>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivity.slice(0, 8).map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <span className="text-base mt-0.5 flex-shrink-0 w-5 text-center">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-slate-700 truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Alerts */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-[13px] font-bold text-slate-800">Urgent Alerts</span>
              {urgentAlerts.length > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                  {urgentAlerts.length}
                </span>
              )}
            </div>
            <button
              onClick={() => onNavigate("alerts")}
              className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium"
            >
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {urgentAlerts.map((a) => (
              <div key={a.id} className="bg-red-50 border border-red-100 rounded-xl p-3.5">
                <p className="text-[12px] font-bold text-red-700 leading-tight">{a.title}</p>
                <p className="text-[11px] text-red-600 mt-1.5 leading-relaxed">{a.message}</p>
                <p className="text-[10px] text-red-400 mt-2">{a.time}</p>
              </div>
            ))}
            {urgentAlerts.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                <p className="font-medium">No urgent alerts</p>
              </div>
            )}
          </div>
        </div>

        {/* Fleet Status */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <Car className="h-4 w-4 text-primary" />
            <span className="text-[13px] font-bold text-slate-800">Fleet Status</span>
          </div>
          <div className="p-5 space-y-4">
            <MiniStatusBar label="Available" count={kpis.availableCars} total={totalFleet} color="bg-emerald-500" />
            <MiniStatusBar label="Rented" count={kpis.rentedCars} total={totalFleet} color="bg-amber-400" />
            <MiniStatusBar label="Reserved" count={kpis.reservedCars} total={totalFleet} color="bg-indigo-500" />
            <MiniStatusBar label="Maintenance" count={kpis.maintenanceCars} total={totalFleet} color="bg-red-400" />

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-400 font-medium">Utilization rate</span>
                <span className="text-[13px] font-bold text-slate-800">
                  {Math.round(((kpis.rentedCars + kpis.reservedCars) / totalFleet) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex gap-px">
                <div className="bg-emerald-500 h-full" style={{ width: `${(kpis.availableCars / totalFleet) * 100}%` }} />
                <div className="bg-amber-400 h-full" style={{ width: `${(kpis.rentedCars / totalFleet) * 100}%` }} />
                <div className="bg-indigo-500 h-full" style={{ width: `${(kpis.reservedCars / totalFleet) * 100}%` }} />
                <div className="bg-red-400 h-full" style={{ width: `${(kpis.maintenanceCars / totalFleet) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Quick-nav tiles */}
          <div className="border-t border-slate-100 p-4 grid grid-cols-2 gap-2">
            {[
              { label: "New Requests", section: "bookings", badge: kpis.pendingRequests },
              { label: "Active Rentals", section: "rentals", badge: kpis.activeRentals },
              { label: "Fleet", section: "fleet", badge: undefined },
              { label: "Walk-in", section: "offline", badge: undefined },
            ].map(({ label, section, badge }) => (
              <button
                key={section}
                onClick={() => onNavigate(section)}
                className="flex items-center justify-between px-3 py-2.5 bg-slate-50 hover:bg-primary/6 rounded-xl text-[12px] font-medium text-slate-600 hover:text-primary transition-colors border border-slate-200 hover:border-primary/20"
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
