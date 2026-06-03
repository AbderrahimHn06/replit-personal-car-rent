import { useState } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/Navbar";
import { Home } from "@/pages/Home";
import { Cars } from "@/pages/Cars";
import { Dashboard } from "@/pages/Dashboard";
import { addBookingRequest } from "@/data/localStore";

const queryClient = new QueryClient();

interface PublicSiteProps {
  addBooking: (booking: any) => void;
}

function PublicSite({ addBooking }: PublicSiteProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/">
            <Home addBooking={addBooking} />
          </Route>
          <Route path="/cars">
            <Cars addBooking={addBooking} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function AppRouter({ addBooking }: PublicSiteProps) {
  const [, navigate] = useLocation();
  return (
    <Switch>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/">
        {() => { navigate("/dashboard"); return null; }}
      </Route>
      <Route>
        <PublicSite addBooking={addBooking} />
      </Route>
    </Switch>
  );
}

function App() {
  const addBooking = (booking: any) => {
    addBookingRequest({
      id: booking.id,
      customer: booking.clientName,
      phone: booking.phone || "0555 000 000",
      email: booking.email || "",
      car: booking.car,
      pickupDate: booking.pickupDate,
      returnDate: booking.returnDate,
      pickupLocation: booking.pickupLocation,
      returnLocation: booking.returnLocation || booking.pickupLocation,
      status: "new",
      source: "online",
      submittedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      notes: booking.notes || "",
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRouter addBooking={addBooking} />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
