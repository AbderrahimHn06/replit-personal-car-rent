import { makeStore } from "./baseStore";
import { FleetVehicle, FleetStatus, CurrencyCode } from "./types";
import { CURRENCY_RATES } from "./settingsStore";

export const INITIAL_FLEET: FleetVehicle[] = [
  {
    id: "f-1", brand: "Dacia", model: "Duster", year: 2023, plate: "DAD-213-31",
    color: "Grey Titanium", type: "SUV", transmission: "Manual", fuel: "Diesel",
    seats: 5, doors: 5, mileage: 45230, engineSize: "1.5 dCi 115hp", vin: "VF1HSRJFD12345678",
    status: "available",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80",
    description: "Reliable SUV, ideal for long trips and family use.",
    notes: "Well maintained. Minor scratch on rear bumper.", internalNotes: "Regular client favorite.",
    isActive: true, isFeatured: true,
    pricePerDay: { amount: 45, currencyCode: "USD" },
    pricePerWeek: { amount: 280, currencyCode: "USD" },
    pricePerMonth: { amount: 900, currencyCode: "USD" },
    prices: { DZD: 6075, USD: 45, EUR: 41 },
    depositAmount: { amount: 150, currencyCode: "USD" },
    lateFee: { amount: 15, currencyCode: "USD" },
    extraMileageFee: { amount: 0.25, currencyCode: "USD" },
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
    pricePerDay: { amount: 30, currencyCode: "USD" },
    pricePerWeek: { amount: 185, currencyCode: "USD" },
    pricePerMonth: { amount: 620, currencyCode: "USD" },
    prices: { DZD: 4050, USD: 30, EUR: 28 },
    depositAmount: { amount: 100, currencyCode: "USD" },
    lateFee: { amount: 10, currencyCode: "USD" },
    extraMileageFee: { amount: 0.20, currencyCode: "USD" },
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
    pricePerDay: { amount: 32, currencyCode: "USD" },
    pricePerWeek: { amount: 200, currencyCode: "USD" },
    pricePerMonth: { amount: 680, currencyCode: "USD" },
    prices: { DZD: 4320, USD: 32, EUR: 29 },
    depositAmount: { amount: 120, currencyCode: "USD" },
    lateFee: { amount: 12, currencyCode: "USD" },
    extraMileageFee: { amount: 0.22, currencyCode: "USD" },
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
    pricePerDay: { amount: 60, currencyCode: "USD" },
    pricePerWeek: { amount: 370, currencyCode: "USD" },
    pricePerMonth: { amount: 1200, currencyCode: "USD" },
    prices: { DZD: 8100, USD: 60, EUR: 55 },
    depositAmount: { amount: 200, currencyCode: "USD" },
    lateFee: { amount: 20, currencyCode: "USD" },
    extraMileageFee: { amount: 0.30, currencyCode: "USD" },
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
    pricePerDay: { amount: 85, currencyCode: "USD" },
    pricePerWeek: { amount: 520, currencyCode: "USD" },
    pricePerMonth: { amount: 1800, currencyCode: "USD" },
    prices: { DZD: 11475, USD: 85, EUR: 78 },
    depositAmount: { amount: 300, currencyCode: "USD" },
    lateFee: { amount: 30, currencyCode: "USD" },
    extraMileageFee: { amount: 0.40, currencyCode: "USD" },
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
    pricePerDay: { amount: 40, currencyCode: "USD" },
    pricePerWeek: { amount: 245, currencyCode: "USD" },
    pricePerMonth: { amount: 820, currencyCode: "USD" },
    prices: { DZD: 5400, USD: 40, EUR: 37 },
    depositAmount: { amount: 130, currencyCode: "USD" },
    lateFee: { amount: 15, currencyCode: "USD" },
    extraMileageFee: { amount: 0.22, currencyCode: "USD" },
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
    pricePerDay: { amount: 25, currencyCode: "USD" },
    pricePerWeek: { amount: 155, currencyCode: "USD" },
    pricePerMonth: { amount: 520, currencyCode: "USD" },
    prices: { DZD: 3375, USD: 25, EUR: 23 },
    depositAmount: { amount: 80, currencyCode: "USD" },
    lateFee: { amount: 8, currencyCode: "USD" },
    extraMileageFee: { amount: 0.18, currencyCode: "USD" },
    insuranceProvider: "SAA Algeria", insuranceNumber: "SAA-2022-KPC-008",
    insuranceStart: "2022-11-01", insuranceEnd: "2026-10-31",
    registrationNumber: "KPC-001-31", registrationExpiry: "2026-11-30",
    inspectionDate: "2026-02-28", inspectionExpiry: "2027-02-28",
    lastService: "2026-02-28", nextService: "2026-08-28",
    lastServiceMileage: 12000, garageName: "Pneus Express, Oran",
  },
];

export const fleetStore = makeStore<FleetVehicle[]>("fleet", INITIAL_FLEET);

export function useFleet() {
  return fleetStore.useValue();
}

export function getFleet() {
  return fleetStore.getValue();
}

export function addCar(c: FleetVehicle) {
  fleetStore.setValue([c, ...fleetStore.getValue()]);
}

export function updateCar(c: FleetVehicle) {
  fleetStore.setValue(fleetStore.getValue().map(x => x.id === c.id ? c : x));
}

export function removeCar(id: string) {
  fleetStore.setValue(fleetStore.getValue().filter(x => x.id !== id));
}

export function updateVehicleStatus(idOrPlate: string, status: FleetStatus) {
  const fleet = fleetStore.getValue();
  const car = fleet.find(c => c.id === idOrPlate || c.plate === idOrPlate);
  if (car) {
    updateCar({ ...car, status });
  }
}

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
