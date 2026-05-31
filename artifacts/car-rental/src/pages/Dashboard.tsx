import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Car, 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MoreHorizontal
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  Body,
  Cell,
  Head,
  Header,
  Row,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Booking, cars as fleetCars } from "@/data/mockData";

export function Dashboard({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState<string>("All");

  const filteredBookings = bookings.filter(b => 
    filter === "All" ? true : b.status === filter
  );

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
    pending: bookings.filter(b => b.status === "Pending").length,
    availableCars: fleetCars.filter(c => c.available).length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 rounded-none">Confirmed</Badge>;
      case "Pending":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 rounded-none">Pending</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 rounded-none">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white uppercase tracking-wider mb-2">Concierge Dashboard</h1>
        <p className="text-muted-foreground">Manage your elite clientele and reservations.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card border-card-border rounded-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Bookings</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card border-card-border rounded-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Confirmed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.confirmed}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-card border-card-border rounded-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.pending}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-card border-card-border rounded-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Available Fleet</CardTitle>
              <Car className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.availableCars} <span className="text-sm font-normal text-muted-foreground">/ {fleetCars.length}</span></div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bookings Management */}
      <div className="mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Recent Reservations</h2>
          
          <Tabs defaultValue="All" value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
            <TabsList className="bg-zinc-900 border border-zinc-800 rounded-none w-full sm:w-auto p-0 h-auto">
              <TabsTrigger value="All" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2">All</TabsTrigger>
              <TabsTrigger value="Pending" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2">Pending</TabsTrigger>
              <TabsTrigger value="Confirmed" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2">Confirmed</TabsTrigger>
              <TabsTrigger value="Cancelled" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card className="bg-card border-card-border rounded-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-zinc-900/50 text-muted-foreground border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium tracking-wider">Client</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Vehicle</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Dates</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Location</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Amount</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                  <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No reservations found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, idx) => (
                    <motion.tr 
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-zinc-900/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-white">{booking.clientName}</div>
                        <div className="text-xs text-muted-foreground">{booking.id}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-300">
                        {booking.car}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-zinc-300">{booking.pickupDate}</div>
                        <div className="text-xs text-muted-foreground">to {booking.returnDate}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        {booking.pickupLocation}
                      </td>
                      <td className="px-6 py-4 font-medium text-primary">
                        ${booking.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-muted-foreground hover:text-white transition-colors">
                          <MoreHorizontal className="h-5 w-5" />
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
        <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6">Fleet Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleetCars.map((car, idx) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-card border-card-border rounded-none overflow-hidden h-full flex flex-col group">
                <div className={`h-32 w-full bg-gradient-to-br ${car.imageGradient} relative`}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute top-4 right-4">
                    {car.available ? (
                      <Badge className="bg-green-500/90 hover:bg-green-500 text-white rounded-none border-none">Available</Badge>
                    ) : (
                      <Badge className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-none border-none">On Trip</Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-white mb-1">{car.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">{car.category}</p>
                  
                  <div className="mt-auto flex justify-between items-center text-sm pt-4 border-t border-zinc-800">
                    <span className="text-zinc-400">{car.seats} Seats • {car.transmission}</span>
                    <span className="font-bold text-primary">${car.pricePerDay}/d</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
