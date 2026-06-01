import { CalendarCheck, UserPlus, Key } from "lucide-react";
import { Booking } from "@/data/mockData";
import { BookingRequests } from "./BookingRequests";
import { OfflineRentals } from "./OfflineRentals";
import { RentalsManagement } from "./RentalsManagement";
import { kpis } from "@/data/dashboardData";

export type OperationsTab = "bookings" | "offline" | "rentals";

interface Props {
  activeTab: OperationsTab;
  onTabChange: (t: OperationsTab) => void;
  bookings: Booking[];
}

const TABS: { id: OperationsTab; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: "bookings", label: "Booking Requests", icon: CalendarCheck, badge: kpis.pendingRequests },
  { id: "offline",  label: "Walk-in Rentals",  icon: UserPlus },
  { id: "rentals",  label: "Rentals",           icon: Key, badge: kpis.activeRentals },
];

export function OperationsSection({ activeTab, onTabChange, bookings }: Props) {
  return (
    <div className="flex flex-col min-h-full">
      {/* Sub-tab bar */}
      <div className="flex items-center gap-1 px-5 sm:px-7 py-4 bg-white border-b border-slate-200/80">
        {TABS.map(({ id, label, icon: Icon, badge }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{label}</span>
              {badge !== undefined && badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/25 text-white" : "bg-primary text-white"
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1">
        {activeTab === "bookings" && <BookingRequests bookings={bookings} />}
        {activeTab === "offline"  && <OfflineRentals />}
        {activeTab === "rentals"  && <RentalsManagement />}
      </div>
    </div>
  );
}
