import { Rental, FleetVehicle, Client, BookingRequest, Payment, CurrencyCode } from "./types";
import { useRentals, getRentals } from "./rentalsStore";
import { useFleet, getFleet } from "./fleetStore";
import { useClients, getClients } from "./clientsStore";
import { useBookingRequests, getBookingRequests } from "./bookingsStore";
import { usePayments, getPayments } from "./paymentsStore";
import { useCurrencySettings, getCurrencySettings, convertMoney } from "./settingsStore";

export interface KPIStats {
  totalBookings: number;
  pendingRequests: number;
  confirmedBookings: number;
  activeRentals: number;
  availableCars: number;
  rentedCars: number;
  maintenanceCars: number;
  reservedCars: number;
  totalClients: number;
  blockedClients: number;
  overdueRentals: number;
  monthlyRevenue: number; // In the currently active currency
  lastMonthRevenue: number; // In the currently active currency
}

export function computeKPIs(
  rentals: Rental[],
  fleet: FleetVehicle[],
  clients: Client[],
  bookings: BookingRequest[],
  payments: Payment[],
  mainCurrency: CurrencyCode
): KPIStats {
  const activeRentals = rentals.filter(r => r.status === "active").length;
  const overdueRentals = rentals.filter(r => r.status === "overdue").length;
  const pendingRequests = bookings.filter(b => b.status === "new" || b.status === "contacted").length;
  const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;

  // Calculate monthly revenue from the payments store converted to the selected currency
  const monthlyRevenue = payments
    .reduce((sum, p) => {
      const converted = convertMoney(p.amount, mainCurrency);
      return sum + converted.amount;
    }, 0);

  // Hardcoded target base value for last month's revenue (3820 USD) converted to selected currency
  const lastMonthUSD = { amount: 3820, currencyCode: "USD" as const };
  const lastMonthConverted = convertMoney(lastMonthUSD, mainCurrency).amount;

  return {
    totalBookings: bookings.length + rentals.length,
    pendingRequests,
    confirmedBookings,
    activeRentals,
    availableCars: fleet.filter(c => c.status === "available").length,
    rentedCars: fleet.filter(c => c.status === "rented").length,
    maintenanceCars: fleet.filter(c => c.status === "maintenance").length,
    reservedCars: fleet.filter(c => c.status === "reserved").length,
    totalClients: clients.filter(c => c.status !== "blocked").length,
    blockedClients: clients.filter(c => c.status === "blocked").length,
    overdueRentals,
    monthlyRevenue,
    lastMonthRevenue: lastMonthConverted,
  };
}

export function useKPIs(): KPIStats {
  const rentals = useRentals();
  const fleet = useFleet();
  const clients = useClients();
  const bookings = useBookingRequests();
  const payments = usePayments();
  const { mainCurrency } = useCurrencySettings();

  return computeKPIs(rentals, fleet, clients, bookings, payments, mainCurrency);
}

export function getKPIs(): KPIStats {
  const rentals = getRentals();
  const fleet = getFleet();
  const clients = getClients();
  const bookings = getBookingRequests();
  const payments = getPayments();
  const { mainCurrency } = getCurrencySettings();

  return computeKPIs(rentals, fleet, clients, bookings, payments, mainCurrency);
}
