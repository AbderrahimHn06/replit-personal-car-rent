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
        return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-medium">Confirmed</Badge>;
      case "Pending":
        return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50 font-medium">Pending</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-50 font-medium">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const statCards = [
    { label: "Total Bookings", value: stats.total, icon: CalendarDays, accent: "text-primary" },
    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle2, accent: "text-emerald-600" },
    { label: "Pending", value: stats.pending, icon: Clock, accent: "text-amber-500" },
    { label: "Available Fleet", value: `${stats.availableCars} / ${fleetCars.length}`, icon: Car, accent: "text-primary" },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-7xl">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage your reservations and fleet.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, accent }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="bg-card border-border shadow-sm rounded-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
                  <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {label}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${accent}`} />
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <div
                    className="text-3xl font-bold text-foreground"
                    data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {value}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-base font-bold text-foreground">Recent Reservations</h2>
            <Tabs defaultValue="All" value={filter} onValueChange={setFilter}>
              <TabsList className="bg-white border border-border h-9 p-0.5 rounded-lg gap-0.5">
                {["All", "Pending", "Confirmed", "Cancelled"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="text-xs px-3 rounded-md data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-none"
                    data-testid={`tab-${tab.toLowerCase()}`}
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <Card className="bg-card border-border shadow-sm rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-5 py-3 font-semibold uppercase tracking-wider">Client</th>
                    <th className="px-5 py-3 font-semibold uppercase tracking-wider">Vehicle</th>
                    <th className="px-5 py-3 font-semibold uppercase tracking-wider">Dates</th>
                    <th className="px-5 py-3 font-semibold uppercase tracking-wider hidden md:table-cell">Location</th>
                    <th className="px-5 py-3 font-semibold uppercase tracking-wider">Amount</th>
                    <th className="px-5 py-3 font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-right font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-14 text-center text-muted-foreground text-sm">
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
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="font-semibold text-foreground text-sm">{booking.clientName}</div>
                          <div className="text-xs text-muted-foreground">{booking.id}</div>
                        </td>
                        <td className="px-5 py-3.5 text-foreground text-sm">{booking.car}</td>
                        <td className="px-5 py-3.5">
                          <div className="text-foreground text-sm">{booking.pickupDate}</div>
                          <div className="text-xs text-muted-foreground">to {booking.returnDate}</div>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground text-sm hidden md:table-cell">
                          {booking.pickupLocation}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-accent text-sm">
                          ${booking.totalPrice.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5">{getStatusBadge(booking.status)}</td>
                        <td className="px-5 py-3.5 text-right">
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
          <h2 className="text-base font-bold text-foreground mb-4">Fleet Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fleetCars.map((car, idx) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.06 }}
                data-testid={`card-fleet-${car.id}`}
              >
                <Card className="bg-card border-border shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-32 overflow-hidden bg-muted">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                      {car.available ? (
                        <Badge className="bg-emerald-500 text-white border-none text-xs shadow-sm">Available</Badge>
                      ) : (
                        <Badge className="bg-muted-foreground text-white border-none text-xs shadow-sm">On Trip</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-3.5">
                    <h3 className="font-bold text-foreground text-sm mb-0.5">{car.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2.5">{car.type} · {car.seats} seats</p>
                    <div className="flex items-center justify-between border-t border-border pt-2.5">
                      <span className="text-xs text-muted-foreground">{car.transmission}</span>
                      <span className="font-bold text-accent text-sm">${car.pricePerDay}<span className="font-normal text-xs text-muted-foreground">/day</span></span>
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
