import { useState } from "react";
import { motion } from "framer-motion";
import { Car, CalendarDays, CheckCircle2, Clock, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Booking, cars as fleetCars } from "@/data/mockData";

export function Dashboard({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState<string>("All");

  const filteredBookings = bookings.filter((b) =>
    filter === "All" ? true : b.status === filter
  );

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    availableCars: fleetCars.filter((c) => c.available).length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">Confirmed</Badge>;
      case "Pending":
        return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">Pending</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const statCards = [
    { label: "Total Bookings", value: stats.total, icon: CalendarDays, iconClass: "text-primary" },
    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle2, iconClass: "text-emerald-600" },
    { label: "Pending", value: stats.pending, icon: Clock, iconClass: "text-amber-500" },
    {
      label: "Available Fleet",
      value: `${stats.availableCars} / ${fleetCars.length}`,
      icon: Car,
      iconClass: "text-primary",
    },
  ];

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Concierge Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage your reservations and fleet overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statCards.map(({ label, value, icon: Icon, iconClass }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="bg-white border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {label}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${iconClass}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
                    {value}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
            <h2 className="text-lg font-bold text-foreground">Recent Reservations</h2>
            <Tabs defaultValue="All" value={filter} onValueChange={setFilter}>
              <TabsList className="bg-white border border-border h-9 p-0.5 rounded-lg">
                {["All", "Pending", "Confirmed", "Cancelled"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="text-xs px-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                    data-testid={`tab-${tab.toLowerCase()}`}
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <Card className="bg-white border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3.5 font-semibold uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3.5 font-semibold uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3.5 font-semibold uppercase tracking-wider hidden md:table-cell">Location</th>
                    <th className="px-6 py-3.5 font-semibold uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3.5 font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 font-semibold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-14 text-center text-muted-foreground text-sm">
                        No reservations found for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking, idx) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.04 }}
                        className="hover:bg-muted/30 transition-colors"
                        data-testid={`row-booking-${booking.id}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-foreground">{booking.clientName}</div>
                          <div className="text-xs text-muted-foreground">{booking.id}</div>
                        </td>
                        <td className="px-6 py-4 text-foreground">{booking.car}</td>
                        <td className="px-6 py-4">
                          <div className="text-foreground">{booking.pickupDate}</div>
                          <div className="text-xs text-muted-foreground">to {booking.returnDate}</div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                          {booking.pickupLocation}
                        </td>
                        <td className="px-6 py-4 font-semibold text-primary">
                          ${booking.totalPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            data-testid={`button-actions-${booking.id}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Fleet Overview */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-5">Fleet Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {fleetCars.map((car, idx) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.07 }}
                data-testid={`card-fleet-${car.id}`}
              >
                <Card className="bg-white border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`h-28 w-full bg-gradient-to-br ${car.imageGradient} relative`}>
                    <div className="absolute top-3 right-3">
                      {car.available ? (
                        <Badge className="bg-emerald-500 text-white border-none text-xs">Available</Badge>
                      ) : (
                        <Badge className="bg-zinc-600 text-white border-none text-xs">On Trip</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-foreground mb-0.5">{car.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">{car.category}</p>
                    <div className="flex justify-between items-center text-sm border-t border-border pt-3">
                      <span className="text-muted-foreground">{car.seats} Seats · {car.transmission}</span>
                      <span className="font-bold text-primary">${car.pricePerDay}/day</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
