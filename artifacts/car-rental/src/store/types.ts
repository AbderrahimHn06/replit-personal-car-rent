export type FleetStatus = "available" | "reserved" | "rented" | "maintenance";
export type RentalStatus = "active" | "overdue" | "completed" | "reserved";
export type ClientStatus = "active" | "blocked" | "new" | "vip";
export type ClientSource = "online" | "walk-in" | "phone";
export type RequestStatus = "new" | "contacted" | "confirmed" | "cancelled";
export type MaintenanceStatus = "due-soon" | "in-progress" | "completed";
export type AlertType = "urgent-booking" | "overdue-rental" | "returning-today" | "maintenance" | "blocked-client";
export type AlertSeverity = "high" | "medium" | "low";
export type RentalSource = "online" | "walk-in" | "phone";
export type CurrencyCode = "DZD" | "USD" | "EUR";
export type LanguageCode = "fr" | "en" | "ar";

export interface Money {
  amount: number;
  currencyCode: CurrencyCode;
}

export interface Agency {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  isActive: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  notes: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface FleetVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  type: string;
  transmission: "Manual" | "Automatic";
  fuel: "Gasoline" | "Diesel" | "Electric";
  seats: number;
  doors: number;
  mileage: number;
  engineSize?: string;
  vin?: string;
  status: FleetStatus;
  image: string;
  images?: string[];
  coverImageIndex?: number;
  description?: string;
  notes: string;
  internalNotes?: string;
  isActive?: boolean;
  isFeatured?: boolean;

  // Pricing model
  pricePerDay: Money;
  pricePerWeek?: Money;
  pricePerMonth?: Money;
  prices?: Partial<Record<CurrencyCode, number>>;
  depositAmount: Money;
  lateFee: Money;
  extraMileageFee: Money;

  // Documents
  insuranceProvider?: string;
  insuranceNumber?: string;
  insuranceStart?: string;
  insuranceEnd?: string;
  registrationNumber?: string;
  registrationExpiry?: string;
  inspectionDate?: string;
  inspectionExpiry?: string;

  // Service details
  lastService: string;
  nextService: string;
  lastServiceMileage?: number;
  maintenanceNotes?: string;
  garageName?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  address?: string;
  nationality: string;
  idNumber?: string;
  licenseNumber: string;
  licenseExpiry?: string;

  source: ClientSource;
  status: ClientStatus;
  joinedDate: string;

  totalRentals: number;
  activeRentals: number;
  completedRentals: number;
  cancelledRentals: number;
  totalSpend: Money;
  lastRentalDate?: string;

  trustScore: number;
  lateReturns: number;
  damages: number;

  depositHeld: Money;
  depositReturned: Money;
  pendingBalance: Money;

  blockedReason?: string;
  blockedRentalRef?: string;
  internalNotes?: string;
  warningNotes?: string;
  dateOfBirth?: string;
}

export interface BookingRequest {
  id: string;
  customer: string;
  phone: string;
  email: string;
  car: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  status: RequestStatus;
  source: RentalSource;
  submittedAt: string;
  notes: string;
  clientId?: string;
  vehicleId?: string;
}

export interface Rental {
  id: string;
  reference: string;
  clientId?: string;
  vehicleId?: string;
  client: string;
  clientPhone: string;
  car: string;
  plate: string;
  startDate: string;
  endDate: string;
  totalPrice: Money;
  deposit: Money;
  status: RentalStatus;
  source: RentalSource;
  pickupLocation: string;
  returnLocation?: string;
  driverLicense: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  car: string;
  plate: string;
  vehicleId?: string;
  type: string;
  status: MaintenanceStatus;
  scheduledDate: string;
  completedDate?: string;
  nextServiceDate?: string;
  notes: string;
  mileage: number;
  garage: string;
  estimatedCost: Money;
}

export interface Payment {
  id: string;
  rentalId: string;
  clientId: string;
  amount: Money;
  paymentMethod: string;
  paymentType: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: AlertSeverity;
  time: string;
  relatedId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "rental" | "booking" | "alert" | "client" | "maintenance";
}

export interface RecentActivity {
  id: string;
  type: "booking" | "rental" | "return" | "client" | "fleet" | "payment";
  title: string;
  description: string;
  time: string;
  icon: string;
}
