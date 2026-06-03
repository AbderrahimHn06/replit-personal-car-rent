export type {
  Location as AgencyLocation,
  Rental as DashboardRental,
  Client as DashboardClient,
  FleetVehicle as FleetCar,
  MaintenanceRecord as MaintenanceItem,
  Alert as AlertItem,
  RecentActivity as ActivityItem,
  Notification as AppNotification,
  CurrencyCode,
  LanguageCode,
  Money,
} from "@/store/types";

export {
  useCurrencySettings,
  updateCurrencySettings,
  getCurrencySettings,
  useLanguageSettings,
  updateLanguageSettings,
  getLanguageSettings,
  useT,
  getT,
  isRTL,
  convertMoney,
  formatMoney,
  formatMoneyRaw,
  CURRENCY_SYMBOLS,
  CURRENCY_NAMES,
  CURRENCY_RATES,
  LANGUAGE_NAMES,
} from "@/store/settingsStore";

export {
  useFleet,
  getFleet,
  addCar,
  updateCar,
  removeCar,
  updateVehicleStatus,
} from "@/store/fleetStore";

export {
  useClients,
  getClients,
  addClientToStore,
  updateClientInStore,
  removeClientFromStore,
  useBlockedClients,
  getBlockedClients,
  addBlockedClient,
  removeBlockedClient,
} from "@/store/clientsStore";

export {
  useRentals,
  getRentals,
  addRental,
  updateRental,
} from "@/store/rentalsStore";

export {
  useBookingRequests,
  getBookingRequests,
  addBookingRequest,
  updateBookingRequest,
  removeBookingRequest,
} from "@/store/bookingsStore";

export {
  useMaintenance,
  getMaintenance,
  addMaintenanceItem,
  updateMaintenanceItem,
  removeMaintenanceItem,
} from "@/store/maintenanceStore";

export {
  usePayments,
  getPayments,
  addPayment,
  removePayment,
} from "@/store/paymentsStore";

export {
  useAlerts,
  getAlerts,
  addAlert,
  removeAlert,
  dismissAllAlerts,
} from "@/store/alertsStore";

export {
  useNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/store/notificationsStore";

export {
  useRecentActivity,
  getRecentActivity,
  addActivityItem,
} from "@/store/recentActivityStore";

export {
  useLocations,
  getLocations,
  useActiveLocations,
  addLocation,
  updateLocation,
  removeLocation,
} from "@/store/locationsStore";

export {
  useKPIs,
  getKPIs,
} from "@/store/kpis";

import { FleetVehicle, CurrencyCode } from "@/store/types";
import { CURRENCY_RATES } from "@/store/settingsStore";

// Backwards-compatible pricing helper for components directly accessing car.pricePerDay
export function getCarPriceInCurrency(car: FleetVehicle, currency: CurrencyCode): number {
  const p = car.prices?.[currency];
  if (p != null) return p;
  // Convert standard USD base rate (since initial data has USD prices)
  const baseRate = car.pricePerDay.amount;
  const fromCurrency = car.pricePerDay.currencyCode;
  const rateInUSD = baseRate / CURRENCY_RATES[fromCurrency];
  return Math.round(rateInUSD * CURRENCY_RATES[currency]);
}
