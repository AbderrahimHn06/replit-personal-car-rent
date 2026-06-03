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
import { Booking, initialBookings } from "@/data/mockData";

const queryClient = new QueryClient();

function PublicSite({ bookings, addBooking }: { bookings: Booking[]; addBooking: (b: Booking) => void }) {
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

function AppRouter({ bookings, addBooking }: { bookings: Booking[]; addBooking: (b: Booking) => void }) {
  const [, navigate] = useLocation();
  return (
    <Switch>
      <Route path="/dashboard">
        <Dashboard bookings={bookings} />
      </Route>
      <Route path="/">
        {() => { navigate("/dashboard"); return null; }}
      </Route>
      <Route>
        <PublicSite bookings={bookings} addBooking={addBooking} />
      </Route>
    </Switch>
  );
}

function App() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const addBooking = (booking: Booking) => setBookings((prev) => [booking, ...prev]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRouter bookings={bookings} addBooking={addBooking} />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
