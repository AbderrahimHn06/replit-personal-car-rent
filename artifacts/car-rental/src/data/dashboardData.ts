export type FleetStatus = "available" | "reserved" | "rented" | "maintenance";
export type RentalStatus = "active" | "overdue" | "completed" | "reserved";
export type ClientStatus = "active" | "blocked" | "new" | "vip";
export type ClientSource = "online" | "walk-in" | "phone";
export type RequestStatus = "new" | "contacted" | "confirmed" | "cancelled";
export type MaintenanceStatus = "due-soon" | "in-progress" | "completed";
export type AlertType = "urgent-booking" | "overdue-rental" | "returning-today" | "maintenance" | "blocked-client";
export type AlertSeverity = "high" | "medium" | "low";
export type RentalSource = "online" | "walk-in" | "phone";

export interface FleetCar {
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

  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  prices?: { DZD?: number; USD?: number; EUR?: number };
  depositAmount?: number;
  lateFee?: number;
  extraMileageFee?: number;

  insuranceProvider?: string;
  insuranceNumber?: string;
  insuranceStart?: string;
  insuranceEnd?: string;
  registrationNumber?: string;
  registrationExpiry?: string;
  inspectionDate?: string;
  inspectionExpiry?: string;

  lastService: string;
  nextService: string;
  lastServiceMileage?: number;
  maintenanceNotes?: string;
  garageName?: string;
}

export interface DashboardClient {
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
  activeRentals?: number;
  completedRentals?: number;
  cancelledRentals?: number;
  totalSpend?: number;
  lastRentalDate?: string;

  trustScore?: number;
  blockedReason?: string;
  lateReturns?: number;
  damages?: number;

  depositHeld?: number;
  depositReturned?: number;
  pendingBalance?: number;

  internalNotes?: string;
  warningNotes?: string;
  dateOfBirth?: string;
}

export interface BlockedClient {
  id: string;
  name: string;
  phone: string;
  reason: string;
  blockedDate: string;
  totalRentals: number;
  relatedRental: string;
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
}

export interface DashboardRental {
  id: string;
  reference: string;
  client: string;
  clientPhone: string;
  car: string;
  plate: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  deposit: number;
  status: RentalStatus;
  source: RentalSource;
  pickupLocation: string;
  returnLocation?: string;
  driverLicense: string;
  notes?: string;
}

export interface MaintenanceItem {
  id: string;
  car: string;
  plate: string;
  type: string;
  status: MaintenanceStatus;
  scheduledDate: string;
  completedDate?: string;
  notes: string;
  mileage: number;
  garage: string;
  estimatedCost: number;
}

export interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: AlertSeverity;
  time: string;
  relatedId?: string;
}

export interface ActivityItem {
  id: string;
  type: "booking" | "rental" | "return" | "client" | "fleet" | "payment";
  title: string;
  description: string;
  time: string;
  icon: string;
}

export const fleet: FleetCar[] = [
  {
    id: "f-1", brand: "Dacia", model: "Duster", year: 2023, plate: "DAD-213-31",
    color: "Grey Titanium", type: "SUV", transmission: "Manual", fuel: "Diesel",
    seats: 5, doors: 5, mileage: 45230, engineSize: "1.5 dCi 115hp", vin: "VF1HSRJFD12345678",
    status: "available",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80",
    description: "Reliable SUV, ideal for long trips and family use.",
    notes: "Well maintained. Minor scratch on rear bumper.", internalNotes: "Regular client favorite.",
    isActive: true, isFeatured: true,
    pricePerDay: 45, pricePerWeek: 280, pricePerMonth: 900,
    prices: { DZD: 6075, USD: 45, EUR: 41 },
    depositAmount: 150, lateFee: 15, extraMileageFee: 0.25,
    insuranceProvider: "AXA Algeria", insuranceNumber: "AXA-2024-DAD-001",
    insuranceStart: "2024-01-01", insuranceEnd: "2026-12-31",
    registrationNumber: "DAD-213-31", registrationExpiry: "2027-06-30",
    inspectionDate: "2026-01-15", inspectionExpiry: "2027-01-15",
    lastService: "2026-03-15", nextService: "2026-09-15",
    lastServiceMileage: 40000, garageName: "Renault Service Center, Oran",
    maintenanceNotes: "Oil and filters changed at 40,000 km.",
  },
  {
    id: "f-2", brand: "Renault", model: "Clio 5", year: 2022, plate: "RCL-031-31",
    color: "Pearl White", type: "Economy", transmission: "Manual", fuel: "Gasoline",
    seats: 5, doors: 5, mileage: 28100, engineSize: "1.0 TCe 100hp", vin: "VF1BJA00012345679",
    status: "available",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=600&q=80",
    description: "Compact city car, fuel efficient and easy to park.",
    notes: "New tires installed Feb 2026.", internalNotes: "Popular for city rentals.",
    isActive: true, isFeatured: false,
    pricePerDay: 30, pricePerWeek: 185, pricePerMonth: 620,
    prices: { DZD: 4050, USD: 30, EUR: 28 },
    depositAmount: 100, lateFee: 10, extraMileageFee: 0.20,
    insuranceProvider: "CAAT Algeria", insuranceNumber: "CAAT-2024-RCL-002",
    insuranceStart: "2024-01-01", insuranceEnd: "2026-12-31",
    registrationNumber: "RCL-031-31", registrationExpiry: "2026-09-30",
    inspectionDate: "2026-02-10", inspectionExpiry: "2027-02-10",
    lastService: "2026-01-10", nextService: "2026-07-10",
    lastServiceMileage: 25000, garageName: "Renault Service Center, Oran",
  },
  {
    id: "f-3", brand: "Peugeot", model: "208", year: 2023, plate: "PGT-208-16",
    color: "Electric Blue", type: "Compact", transmission: "Automatic", fuel: "Gasoline",
    seats: 5, doors: 5, mileage: 19400, engineSize: "1.2 PureTech 130hp",
    status: "reserved",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80",
    description: "Sporty compact with automatic gearbox and premium interior.",
    notes: "Reserved by Karima Benali — pickup 2026-06-01.", internalNotes: "VIP client. Ensure AC serviced.",
    isActive: true, isFeatured: true,
    pricePerDay: 32, pricePerWeek: 200, pricePerMonth: 680,
    prices: { DZD: 4320, USD: 32, EUR: 29 },
    depositAmount: 120, lateFee: 12, extraMileageFee: 0.22,
    insuranceProvider: "SAA Algeria", insuranceNumber: "SAA-2024-PGT-003",
    insuranceStart: "2024-03-01", insuranceEnd: "2027-02-28",
    registrationNumber: "PGT-208-16", registrationExpiry: "2027-03-31",
    inspectionDate: "2026-02-20", inspectionExpiry: "2027-02-20",
    lastService: "2026-02-20", nextService: "2026-08-20",
    lastServiceMileage: 15000, garageName: "Peugeot Algeria, Oran",
  },
  {
    id: "f-5", brand: "Hyundai", model: "Tucson", year: 2023, plate: "HYT-045-31",
    color: "Pearl White", type: "SUV", transmission: "Automatic", fuel: "Diesel",
    seats: 5, doors: 5, mileage: 22500, engineSize: "1.6 CRDi 136hp",
    status: "rented",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80",
    description: "Premium SUV with full connectivity and safety pack.",
    notes: "Currently rented to Youcef Mebarki. Return 2026-06-07.",
    isActive: true, isFeatured: true,
    pricePerDay: 60, pricePerWeek: 370, pricePerMonth: 1200,
    prices: { DZD: 8100, USD: 60, EUR: 55 },
    depositAmount: 200, lateFee: 20, extraMileageFee: 0.30,
    insuranceProvider: "AXA Algeria", insuranceNumber: "AXA-2024-HYT-005",
    insuranceStart: "2024-04-01", insuranceEnd: "2027-03-31",
    registrationNumber: "HYT-045-31", registrationExpiry: "2028-04-30",
    inspectionDate: "2026-03-01", inspectionExpiry: "2027-03-01",
    lastService: "2026-03-01", nextService: "2026-09-01",
    lastServiceMileage: 20000, garageName: "Hyundai Service Center, Oran",
  },
  {
    id: "f-6", brand: "Mercedes-Benz", model: "C-Class", year: 2021, plate: "MBC-300-16",
    color: "Obsidian Black", type: "Luxury", transmission: "Automatic", fuel: "Gasoline",
    seats: 5, doors: 4, mileage: 87200, engineSize: "2.0 Turbo 204hp", vin: "WDD2050081F456789",
    status: "maintenance",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80",
    description: "Executive sedan with AMG styling and full luxury package.",
    notes: "In maintenance — AC compressor replacement. Est. ready 2026-06-03.",
    internalNotes: "Only available for VIP/corporate clients.",
    isActive: true, isFeatured: true,
    pricePerDay: 85, pricePerWeek: 520, pricePerMonth: 1800,
    prices: { DZD: 11475, USD: 85, EUR: 78 },
    depositAmount: 300, lateFee: 30, extraMileageFee: 0.40,
    insuranceProvider: "AXA Algeria", insuranceNumber: "AXA-2021-MBC-006",
    insuranceStart: "2021-06-01", insuranceEnd: "2027-05-31",
    registrationNumber: "MBC-300-16", registrationExpiry: "2027-11-30",
    inspectionDate: "2025-11-20", inspectionExpiry: "2026-11-20",
    lastService: "2025-11-20", nextService: "2026-05-20",
    lastServiceMileage: 85000, garageName: "Auto Prestige Garage, Oran",
    maintenanceNotes: "AC compressor replaced. Awaiting gas recharge.",
  },
  {
    id: "f-7", brand: "Toyota", model: "Corolla", year: 2023, plate: "TYC-021-16",
    color: "Midnight Black", type: "Sedan", transmission: "Automatic", fuel: "Gasoline",
    seats: 5, doors: 4, mileage: 41600, engineSize: "1.8 VVT-i 140hp",
    status: "available",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80",
    description: "Reliable and comfortable sedan, perfect for business travel.",
    notes: "Full service done April 2026. Clean interior.", internalNotes: "Often requested by corporate clients.",
    isActive: true, isFeatured: false,
    pricePerDay: 40, pricePerWeek: 245, pricePerMonth: 820,
    prices: { DZD: 5400, USD: 40, EUR: 37 },
    depositAmount: 130, lateFee: 15, extraMileageFee: 0.22,
    insuranceProvider: "CAAT Algeria", insuranceNumber: "CAAT-2023-TYC-007",
    insuranceStart: "2023-08-01", insuranceEnd: "2027-07-31",
    registrationNumber: "TYC-021-16", registrationExpiry: "2027-08-31",
    inspectionDate: "2026-04-12", inspectionExpiry: "2027-04-12",
    lastService: "2026-04-12", nextService: "2026-10-12",
    lastServiceMileage: 40000, garageName: "Toyota Algeria, Oran",
  },
  {
    id: "f-8", brand: "Kia", model: "Picanto", year: 2022, plate: "KPC-001-31",
    color: "Lime Green", type: "City", transmission: "Manual", fuel: "Gasoline",
    seats: 4, doors: 5, mileage: 15300, engineSize: "1.0 MPI 67hp",
    status: "rented",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=600&q=80",
    description: "Ultra-compact city car, easy parking, very economical.",
    notes: "Currently rented to Fatima Ziani. Return today.",
    isActive: true, isFeatured: false,
    pricePerDay: 25, pricePerWeek: 155, pricePerMonth: 520,
    prices: { DZD: 3375, USD: 25, EUR: 23 },
    depositAmount: 80, lateFee: 8, extraMileageFee: 0.18,
    insuranceProvider: "SAA Algeria", insuranceNumber: "SAA-2022-KPC-008",
    insuranceStart: "2022-11-01", insuranceEnd: "2026-10-31",
    registrationNumber: "KPC-001-31", registrationExpiry: "2026-11-30",
    inspectionDate: "2026-02-28", inspectionExpiry: "2027-02-28",
    lastService: "2026-02-28", nextService: "2026-08-28",
    lastServiceMileage: 12000, garageName: "Pneus Express, Oran",
  },
];

export const clients: DashboardClient[] = [
  {
    id: "cl-1", name: "Karima Benali", phone: "0555 123 456", whatsapp: "0555 123 456",
    email: "karima.benali@gmail.com", city: "Oran", address: "12 Rue Larbi Ben M'hidi, Oran",
    nationality: "Algerian", idNumber: "31-09-123456-7", licenseNumber: "DL-09-2031-A", licenseExpiry: "2029-03-10",
    source: "online", status: "vip", joinedDate: "2025-03-10",
    totalRentals: 4, activeRentals: 1, completedRentals: 3, cancelledRentals: 0,
    totalSpend: 620, lastRentalDate: "2026-06-01",
    trustScore: 95, lateReturns: 0, damages: 0,
    depositHeld: 100, depositReturned: 0, pendingBalance: 0,
    internalNotes: "Excellent client. Always on time. Prefers automatic cars.",
  },
  {
    id: "cl-2", name: "Youcef Mebarki", phone: "0661 987 321", whatsapp: "0661 987 321",
    email: "y.mebarki@yahoo.fr", city: "Alger", address: "45 Avenue Pasteur, Alger",
    nationality: "Algerian", idNumber: "16-87-234567-8", licenseNumber: "DL-16-1892-B", licenseExpiry: "2028-11-05",
    source: "walk-in", status: "active", joinedDate: "2024-11-05",
    totalRentals: 7, activeRentals: 1, completedRentals: 6, cancelledRentals: 0,
    totalSpend: 1850, lastRentalDate: "2026-06-01",
    trustScore: 88, lateReturns: 1, damages: 0,
    depositHeld: 200, depositReturned: 0, pendingBalance: 0,
    internalNotes: "Loyal walk-in client. Occasional late returns but always pays.",
  },
  {
    id: "cl-3", name: "Sarah Johnson", phone: "0770 234 567", whatsapp: "0770 234 567",
    email: "sarah.j@outlook.com", city: "Oran", address: "Hotel Meridien, Oran",
    nationality: "British", idNumber: "UK-PASS-AB123456", licenseNumber: "DL-UK-44521", licenseExpiry: "2030-01-18",
    source: "online", status: "new", joinedDate: "2026-01-18",
    totalRentals: 2, activeRentals: 0, completedRentals: 2, cancelledRentals: 0,
    totalSpend: 290, lastRentalDate: "2026-04-24",
    trustScore: 80, lateReturns: 0, damages: 0,
    depositHeld: 0, depositReturned: 80, pendingBalance: 0,
    internalNotes: "Visiting for tourism. Always books from airport.",
  },
  {
    id: "cl-4", name: "Mohamed Amine Rais", phone: "0551 456 789", whatsapp: "0551 456 789",
    email: "m.rais@gmail.com", city: "Constantine", address: "22 Rue Salah Bey, Constantine",
    nationality: "Algerian", idNumber: "25-85-345678-9", licenseNumber: "DL-25-0034-C", licenseExpiry: "2027-08-22",
    source: "walk-in", status: "active", joinedDate: "2025-08-22",
    totalRentals: 3, activeRentals: 0, completedRentals: 3, cancelledRentals: 0,
    totalSpend: 480, lastRentalDate: "2026-05-05",
    trustScore: 82, lateReturns: 0, damages: 0,
    depositHeld: 0, depositReturned: 130, pendingBalance: 0,
  },
  {
    id: "cl-5", name: "Fatima Ziani", phone: "0664 321 098", whatsapp: "0664 321 098",
    email: "f.ziani@email.dz", city: "Tlemcen", address: "7 Rue Khemisti, Tlemcen",
    nationality: "Algerian", idNumber: "13-81-456789-0", licenseNumber: "DL-13-5501-A", licenseExpiry: "2028-05-14",
    source: "online", status: "active", joinedDate: "2025-05-14",
    totalRentals: 5, activeRentals: 1, completedRentals: 4, cancelledRentals: 0,
    totalSpend: 730, lastRentalDate: "2026-05-29",
    trustScore: 72, lateReturns: 1, damages: 0,
    depositHeld: 50, depositReturned: 0, pendingBalance: 0,
    warningNotes: "Current rental overdue since 2026-05-31. Follow up required.",
  },
  {
    id: "cl-6", name: "Lamine Bouzidi", phone: "0771 678 901", whatsapp: "0771 678 901",
    email: "lamine.b@gmail.com", city: "Annaba", address: "18 Cours de la Révolution, Annaba",
    nationality: "Algerian", idNumber: "23-78-567890-1", licenseNumber: "DL-23-2210-B", licenseExpiry: "2027-09-30",
    source: "walk-in", status: "active", joinedDate: "2024-09-30",
    totalRentals: 6, activeRentals: 0, completedRentals: 6, cancelledRentals: 0,
    totalSpend: 1240, lastRentalDate: "2026-05-22",
    trustScore: 90, lateReturns: 0, damages: 0,
    depositHeld: 0, depositReturned: 150, pendingBalance: 0,
    internalNotes: "Very reliable client. Repeat customer since 2024.",
  },
  {
    id: "cl-7", name: "Emma Dupont", phone: "0555 890 123", whatsapp: "0555 890 123",
    email: "emma.d@mail.fr", city: "Alger", address: "Sheraton Hotel, Alger",
    nationality: "French", idNumber: "FR-PASS-CD789012", licenseNumber: "DL-FR-77332", licenseExpiry: "2031-02-07",
    source: "online", status: "new", joinedDate: "2026-02-07",
    totalRentals: 2, activeRentals: 0, completedRentals: 1, cancelledRentals: 1,
    totalSpend: 90, lastRentalDate: "2026-03-10",
    trustScore: 70, lateReturns: 0, damages: 0,
    depositHeld: 0, depositReturned: 80, pendingBalance: 0,
    internalNotes: "Cancelled one booking last minute. Occasional visitor.",
  },
  {
    id: "cl-8", name: "Khalil Hadjadj", phone: "0662 345 678", whatsapp: "0662 345 678",
    email: "k.hadjadj@gmail.com", city: "Sétif", address: "5 Rue de l'Indépendance, Sétif",
    nationality: "Algerian", idNumber: "19-76-678901-2", licenseNumber: "DL-19-3345-D", licenseExpiry: "2028-07-19",
    source: "walk-in", status: "active", joinedDate: "2025-07-19",
    totalRentals: 4, activeRentals: 0, completedRentals: 4, cancelledRentals: 0,
    totalSpend: 580, lastRentalDate: "2026-05-14",
    trustScore: 87, lateReturns: 0, damages: 0,
    depositHeld: 0, depositReturned: 80, pendingBalance: 0,
  },
  {
    id: "cl-9", name: "Nadia Berkouk", phone: "0772 012 345", whatsapp: "0772 012 345",
    email: "nadia.berkouk@gmail.com", city: "Oran", address: "33 Rue Mohamed Khemisti, Oran",
    nationality: "Algerian", idNumber: "31-77-789012-3", licenseNumber: "DL-31-7823-A", licenseExpiry: "2029-01-25",
    source: "online", status: "vip", joinedDate: "2025-01-25",
    totalRentals: 6, activeRentals: 0, completedRentals: 6, cancelledRentals: 0,
    totalSpend: 980, lastRentalDate: "2026-05-05",
    trustScore: 94, lateReturns: 0, damages: 0,
    depositHeld: 0, depositReturned: 100, pendingBalance: 0,
    internalNotes: "VIP repeat client. Always pays full deposit. Prefers Corolla or Tucson.",
  },
  {
    id: "cl-10", name: "David Chen", phone: "0553 678 901", whatsapp: "0553 678 901",
    email: "d.chen@outlook.com", city: "Alger", address: "Hilton Hotel, Alger",
    nationality: "Chinese", idNumber: "CN-PASS-G12345678", licenseNumber: "DL-CN-19284", licenseExpiry: "2030-04-01",
    source: "online", status: "new", joinedDate: "2026-04-01",
    totalRentals: 1, activeRentals: 0, completedRentals: 1, cancelledRentals: 0,
    totalSpend: 200, lastRentalDate: "2026-04-05",
    trustScore: 75, lateReturns: 0, damages: 0,
    depositHeld: 0, depositReturned: 130, pendingBalance: 0,
    internalNotes: "Business travel. Needs official receipt. First rental successful.",
  },
  {
    id: "cl-11", name: "Aissa Rahmani", phone: "0663 234 567", whatsapp: "0663 234 567",
    email: "aissa.r@gmail.com", city: "Tizi Ouzou", address: "8 Avenue Abane Ramdane, Tizi Ouzou",
    nationality: "Algerian", idNumber: "15-79-890123-4", licenseNumber: "DL-15-6612-C", licenseExpiry: "2027-06-03",
    source: "walk-in", status: "active", joinedDate: "2025-06-03",
    totalRentals: 4, activeRentals: 0, completedRentals: 4, cancelledRentals: 0,
    totalSpend: 660, lastRentalDate: "2026-04-18",
    trustScore: 85, lateReturns: 0, damages: 0,
    depositHeld: 0, depositReturned: 150, pendingBalance: 0,
  },
  {
    id: "cl-12", name: "Victoria Grant", phone: "0774 890 234", whatsapp: "0774 890 234",
    email: "v.grant@email.com", city: "Oran", address: "Royal Hotel, Oran",
    nationality: "American", idNumber: "US-PASS-A12345678", licenseNumber: "DL-US-55123", licenseExpiry: "2032-10-11",
    source: "online", status: "active", joinedDate: "2025-10-11",
    totalRentals: 3, activeRentals: 1, completedRentals: 2, cancelledRentals: 0,
    totalSpend: 480, lastRentalDate: "2026-06-25",
    trustScore: 83, lateReturns: 0, damages: 0,
    depositHeld: 150, depositReturned: 0, pendingBalance: 0,
  },
];

export const blockedClients: BlockedClient[] = [
  { id: "bc-1", name: "Reda Chaouch", phone: "0665 111 222", reason: "Returned vehicle damaged (front bumper) and refused to pay repair costs.", blockedDate: "2026-02-14", totalRentals: 2, relatedRental: "RNT-2026-0041" },
  { id: "bc-2", name: "Hocine Amrani", phone: "0778 333 444", reason: "Non-payment of outstanding balance ($320) from rental in Jan 2026.", blockedDate: "2026-01-28", totalRentals: 3, relatedRental: "RNT-2026-0018" },
  { id: "bc-3", name: "Sofiane Belounis", phone: "0556 555 666", reason: "Provided false identity documents. Case referred to legal.", blockedDate: "2026-03-05", totalRentals: 1, relatedRental: "RNT-2026-0052" },
];

export const bookingRequests: BookingRequest[] = [
  { id: "br-1", customer: "Karima Benali", phone: "0555 123 456", email: "karima.benali@gmail.com", car: "Peugeot 208", pickupDate: "2026-06-01", returnDate: "2026-06-05", pickupLocation: "Oran Airport", returnLocation: "Oran Airport", status: "confirmed", source: "online", submittedAt: "2026-05-28 14:30", notes: "Please have AC checked before pickup." },
  { id: "br-2", customer: "Sarah Johnson", phone: "0770 234 567", email: "sarah.j@outlook.com", car: "Dacia Duster", pickupDate: "2026-06-10", returnDate: "2026-06-15", pickupLocation: "Oran Airport", returnLocation: "Agency Main Office", status: "new", source: "online", submittedAt: "2026-05-31 09:15", notes: "International license, arriving flight AH-501." },
  { id: "br-3", customer: "David Chen", phone: "0553 678 901", email: "d.chen@outlook.com", car: "Toyota Corolla", pickupDate: "2026-07-01", returnDate: "2026-07-05", pickupLocation: "Agency Main Office", returnLocation: "Agency Main Office", status: "contacted", source: "online", submittedAt: "2026-05-30 16:45", notes: "Business trip. Needs receipt." },
  { id: "br-4", customer: "Victoria Grant", phone: "0774 890 234", email: "v.grant@email.com", car: "Volkswagen Golf 8", pickupDate: "2026-06-25", returnDate: "2026-06-30", pickupLocation: "Oran City Center", returnLocation: "Oran City Center", status: "confirmed", source: "online", submittedAt: "2026-05-29 11:00", notes: "" },
  { id: "br-5", customer: "Nadia Berkouk", phone: "0772 012 345", email: "nadia.berkouk@gmail.com", car: "Renault Clio 5", pickupDate: "2026-06-08", returnDate: "2026-06-12", pickupLocation: "Agency Main Office", returnLocation: "Agency Main Office", status: "new", source: "online", submittedAt: "2026-05-31 10:30", notes: "Prefers morning pickup." },
  { id: "br-6", customer: "Emma Dupont", phone: "0555 890 123", email: "emma.d@mail.fr", car: "Kia Picanto", pickupDate: "2026-06-03", returnDate: "2026-06-06", pickupLocation: "Oran City Center", returnLocation: "Oran City Center", status: "cancelled", source: "phone", submittedAt: "2026-05-27 08:20", notes: "Cancelled by client." },
  { id: "br-7", customer: "Aissa Rahmani", phone: "0663 234 567", email: "aissa.r@gmail.com", car: "Hyundai Tucson", pickupDate: "2026-06-14", returnDate: "2026-06-18", pickupLocation: "Agency Main Office", returnLocation: "Agency Main Office", status: "new", source: "online", submittedAt: "2026-05-31 07:45", notes: "Family trip, needs child seat." },
  { id: "br-8", customer: "Mohamed Amine Rais", phone: "0551 456 789", email: "m.rais@gmail.com", car: "Toyota Corolla", pickupDate: "2026-06-20", returnDate: "2026-06-23", pickupLocation: "Agency Main Office", returnLocation: "Agency Main Office", status: "contacted", source: "online", submittedAt: "2026-05-30 13:10", notes: "" },
];

export const rentals: DashboardRental[] = [
  { id: "r-1", reference: "RNT-2026-0071", client: "Youcef Mebarki", clientPhone: "0661 987 321", car: "Hyundai Tucson", plate: "HYT-045-31", startDate: "2026-06-01", endDate: "2026-06-07", totalPrice: 420, deposit: 200, status: "active", source: "walk-in", pickupLocation: "Agency Main Office", returnLocation: "Agency Main Office", driverLicense: "DL-16-1892-B" },
  { id: "r-2", reference: "RNT-2026-0070", client: "Fatima Ziani", clientPhone: "0664 321 098", car: "Kia Picanto", plate: "KPC-001-31", startDate: "2026-05-29", endDate: "2026-05-31", totalPrice: 50, deposit: 50, status: "overdue", source: "online", pickupLocation: "Oran City Center", returnLocation: "Oran City Center", driverLicense: "DL-13-5501-A" },
  { id: "r-3", reference: "RNT-2026-0069", client: "Karima Benali", clientPhone: "0555 123 456", car: "Peugeot 208", plate: "PGT-208-16", startDate: "2026-06-01", endDate: "2026-06-05", totalPrice: 128, deposit: 100, status: "reserved", source: "online", pickupLocation: "Oran Airport", returnLocation: "Oran Airport", driverLicense: "DL-09-2031-A" },
  { id: "r-4", reference: "RNT-2026-0065", client: "James Sterling", clientPhone: "0770 111 222", car: "Mercedes-Benz C-Class", plate: "MBC-300-16", startDate: "2026-06-15", endDate: "2026-06-18", totalPrice: 255, deposit: 300, status: "reserved", source: "online", pickupLocation: "Agency Main Office", returnLocation: "Agency Main Office", driverLicense: "DL-UK-11245" },
  { id: "r-5", reference: "RNT-2026-0060", client: "Lamine Bouzidi", clientPhone: "0771 678 901", car: "Dacia Duster", plate: "DAD-213-31", startDate: "2026-05-15", endDate: "2026-05-22", totalPrice: 315, deposit: 150, status: "completed", source: "walk-in", pickupLocation: "Agency Main Office", returnLocation: "Agency Main Office", driverLicense: "DL-23-2210-B" },
  { id: "r-6", reference: "RNT-2026-0058", client: "Victoria Grant", clientPhone: "0774 890 234", car: "Volkswagen Golf 8", plate: "VWG-860-31", startDate: "2026-06-25", endDate: "2026-06-30", totalPrice: 250, deposit: 150, status: "reserved", source: "online", pickupLocation: "Oran City Center", returnLocation: "Oran City Center", driverLicense: "DL-US-55123" },
  { id: "r-7", reference: "RNT-2026-0055", client: "Khalil Hadjadj", clientPhone: "0662 345 678", car: "Renault Clio 5", plate: "RCL-031-31", startDate: "2026-05-10", endDate: "2026-05-14", totalPrice: 120, deposit: 80, status: "completed", source: "walk-in", pickupLocation: "Agency Main Office", returnLocation: "Agency Main Office", driverLicense: "DL-19-3345-D" },
  { id: "r-8", reference: "RNT-2026-0048", client: "Nadia Berkouk", clientPhone: "0772 012 345", car: "Toyota Corolla", plate: "TYC-021-16", startDate: "2026-05-01", endDate: "2026-05-05", totalPrice: 160, deposit: 100, status: "completed", source: "online", pickupLocation: "Oran City Center", returnLocation: "Oran City Center", driverLicense: "DL-31-7823-A" },
  { id: "r-9", reference: "RNT-2026-0041", client: "Reda Chaouch", clientPhone: "0665 111 222", car: "Dacia Duster", plate: "DAD-213-31", startDate: "2026-02-01", endDate: "2026-02-05", totalPrice: 180, deposit: 100, status: "completed", source: "walk-in", pickupLocation: "Agency Main Office", returnLocation: "Agency Main Office", driverLicense: "DL-31-4401-X" },
  { id: "r-10", reference: "RNT-2026-0039", client: "Sarah Johnson", clientPhone: "0770 234 567", car: "Renault Clio 5", plate: "RCL-031-31", startDate: "2026-04-20", endDate: "2026-04-24", totalPrice: 120, deposit: 80, status: "completed", source: "online", pickupLocation: "Oran Airport", returnLocation: "Oran Airport", driverLicense: "DL-UK-44521" },
];

export const maintenance: MaintenanceItem[] = [
  { id: "m-1", car: "Mercedes-Benz C-Class", plate: "MBC-300-16", type: "AC Compressor Replacement", status: "in-progress", scheduledDate: "2026-05-29", notes: "AC not cooling. Compressor replaced. Awaiting gas recharge.", mileage: 87200, garage: "Auto Prestige Garage, Oran", estimatedCost: 450 },
  { id: "m-2", car: "Dacia Duster", plate: "DAD-213-31", type: "Oil Change + Filter", status: "due-soon", scheduledDate: "2026-06-10", notes: "Last oil change at 40,000 km. Due at 50,000 km.", mileage: 45230, garage: "Renault Service Center, Oran", estimatedCost: 85 },
  { id: "m-3", car: "Renault Clio 5", plate: "RCL-031-31", type: "Brake Pad Replacement", status: "due-soon", scheduledDate: "2026-06-15", notes: "Front brake pads showing wear. Rear pads OK.", mileage: 28100, garage: "Renault Service Center, Oran", estimatedCost: 120 },
  { id: "m-4", car: "Toyota Corolla", plate: "TYC-021-16", type: "Full Service Inspection", status: "completed", scheduledDate: "2026-04-12", completedDate: "2026-04-12", notes: "All checks passed. Oil, filters, tires all replaced.", mileage: 41600, garage: "Toyota Algeria, Oran", estimatedCost: 200 },
  { id: "m-5", car: "Kia Picanto", plate: "KPC-001-31", type: "Tire Rotation & Alignment", status: "due-soon", scheduledDate: "2026-06-20", notes: "Slight pull to right detected. Alignment recommended.", mileage: 15300, garage: "Pneus Express, Oran", estimatedCost: 60 },
  { id: "m-7", car: "Hyundai Tucson", plate: "HYT-045-31", type: "Coolant System Flush", status: "due-soon", scheduledDate: "2026-07-01", notes: "Coolant change due per manufacturer schedule.", mileage: 22500, garage: "Hyundai Service Center, Oran", estimatedCost: 90 },
];

export const alerts: AlertItem[] = [
  { id: "a-1", type: "overdue-rental", title: "Overdue Rental — Fatima Ziani", message: "Kia Picanto (KPC-001-31) was due 2026-05-31 (1 day overdue). Client not yet returned vehicle.", severity: "high", time: "2h ago", relatedId: "r-2" },
  { id: "a-2", type: "urgent-booking", title: "New Booking Request — Sarah Johnson", message: "Requested Dacia Duster for June 10–15. Arriving on flight AH-501. Needs airport pickup.", severity: "high", time: "4h ago", relatedId: "br-2" },
  { id: "a-3", type: "urgent-booking", title: "New Booking Request — Nadia Berkouk", message: "Requested Renault Clio 5 for June 8–12. Awaiting confirmation.", severity: "high", time: "6h ago", relatedId: "br-5" },
  { id: "a-4", type: "urgent-booking", title: "New Booking Request — Aissa Rahmani", message: "Requested Hyundai Tucson June 14–18. Needs child seat (extra charge).", severity: "high", time: "8h ago", relatedId: "br-7" },
  { id: "a-5", type: "returning-today", title: "Vehicle Returning Today — Kia Picanto", message: "Kia Picanto (KPC-001-31) rented to Fatima Ziani was due today. Not yet returned.", severity: "medium", time: "Today", relatedId: "r-2" },
  { id: "a-6", type: "maintenance", title: "Maintenance Due — Dacia Duster", message: "Oil change scheduled for June 10. Book appointment with Renault Service Center.", severity: "medium", time: "Scheduled 06-10", relatedId: "m-2" },
  { id: "a-7", type: "maintenance", title: "Maintenance Due — Renault Clio 5", message: "Front brake pads need replacement. Scheduled June 15.", severity: "medium", time: "Scheduled 06-15", relatedId: "m-3" },
  { id: "a-8", type: "blocked-client", title: "Blocked Client Attempt — Reda Chaouch", message: "Blocked client Reda Chaouch (+213665111222) contacted us via phone requesting a rental.", severity: "medium", time: "1 day ago", relatedId: "bc-1" },
  { id: "a-9", type: "maintenance", title: "Car in Maintenance — Mercedes C-Class", message: "Mercedes-Benz C-Class (MBC-300-16) in maintenance since May 29. Est. ready June 3.", severity: "low", time: "3 days ago", relatedId: "m-1" },
  { id: "a-10", type: "maintenance", title: "Maintenance Due — Kia Picanto", message: "Tire rotation and alignment recommended for Kia Picanto. Due June 20.", severity: "low", time: "Scheduled 06-20", relatedId: "m-5" },
];

export const recentActivity: ActivityItem[] = [
  { id: "act-1", type: "booking", title: "New Booking Request", description: "Aissa Rahmani requested Hyundai Tucson (Jun 14–18)", time: "8 min ago", icon: "📋" },
  { id: "act-2", type: "booking", title: "New Booking Request", description: "Nadia Berkouk requested Renault Clio 5 (Jun 8–12)", time: "35 min ago", icon: "📋" },
  { id: "act-3", type: "rental", title: "Rental Started", description: "Youcef Mebarki — Hyundai Tucson (RNT-2026-0071)", time: "2h ago", icon: "🔑" },
  { id: "act-4", type: "booking", title: "Booking Confirmed", description: "Victoria Grant — VW Golf 8 confirmed for Jun 25–30", time: "3h ago", icon: "✅" },
  { id: "act-5", type: "booking", title: "New Booking Request", description: "Sarah Johnson requested Dacia Duster (Jun 10–15)", time: "4h ago", icon: "📋" },
  { id: "act-6", type: "fleet", title: "Car Sent to Maintenance", description: "Mercedes-Benz C-Class (MBC-300-16) — AC repair", time: "Yesterday", icon: "🔧" },
  { id: "act-7", type: "return", title: "Rental Returned", description: "Khalil Hadjadj returned Renault Clio 5 — $120 collected", time: "Yesterday", icon: "🏁" },
  { id: "act-8", type: "client", title: "Client Blocked", description: "Sofiane Belounis blocked — false identity documents", time: "2 days ago", icon: "🚫" },
  { id: "act-9", type: "booking", title: "Booking Cancelled", description: "Emma Dupont cancelled Kia Picanto reservation", time: "4 days ago", icon: "❌" },
  { id: "act-10", type: "payment", title: "Payment Received", description: "Lamine Bouzidi — $315 for Dacia Duster rental", time: "5 days ago", icon: "💰" },
];

export const kpis = {
  totalBookings: 23,
  pendingRequests: 4,
  confirmedBookings: 12,
  activeRentals: 2,
  availableCars: 4,
  rentedCars: 2,
  maintenanceCars: 1,
  reservedCars: 1,
  totalClients: 12,
  blockedClients: 3,
  overdueRentals: 1,
  monthlyRevenue: 4250,
  lastMonthRevenue: 3820,
};
