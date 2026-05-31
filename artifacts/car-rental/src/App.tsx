import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/Navbar";
import { Home } from "@/pages/Home";
import { Dashboard } from "@/pages/Dashboard";
import { Booking, initialBookings } from "@/data/mockData";

const queryClient = new QueryClient();

export function AppRouter({ 
  bookings, 
  addBooking 
}: { 
  bookings: Booking[], 
  addBooking: (b: Booking) => void 
}) {
  return (
    <Switch>
      <Route path="/">
        <Home addBooking={addBooking} />
      </Route>
      <Route path="/dashboard">
        <Dashboard bookings={bookings} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  // Apply dark mode by default for this project
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const addBooking = (booking: Booking) => {
    setBookings([booking, ...bookings]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="relative min-h-screen flex flex-col bg-background text-foreground">
            <Navbar />
            <main className="flex-1">
              <AppRouter bookings={bookings} addBooking={addBooking} />
            </main>
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
