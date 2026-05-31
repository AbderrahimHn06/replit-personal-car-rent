export type CarType = "SUV" | "Economy" | "Compact" | "Luxury" | "Sedan" | "City";

export type Car = {
  id: string;
  name: string;
  type: CarType;
  pricePerDay: number;
  seats: number;
  transmission: "Manual" | "Automatic";
  available: boolean;
  image: string;
};

export const cars: Car[] = [
  {
    id: "car-1",
    name: "Dacia Duster",
    type: "SUV",
    pricePerDay: 45,
    seats: 5,
    transmission: "Manual",
    available: true,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "car-2",
    name: "Renault Clio 5",
    type: "Economy",
    pricePerDay: 30,
    seats: 5,
    transmission: "Manual",
    available: true,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "car-3",
    name: "Peugeot 208",
    type: "Compact",
    pricePerDay: 32,
    seats: 5,
    transmission: "Automatic",
    available: true,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "car-4",
    name: "Volkswagen Golf 8",
    type: "Compact",
    pricePerDay: 50,
    seats: 5,
    transmission: "Automatic",
    available: true,
    image: "https://images.unsplash.com/photo-1617814076668-6f9c3f6a1e72?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "car-5",
    name: "Hyundai Tucson",
    type: "SUV",
    pricePerDay: 60,
    seats: 5,
    transmission: "Automatic",
    available: true,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "car-6",
    name: "Mercedes-Benz C-Class",
    type: "Luxury",
    pricePerDay: 85,
    seats: 5,
    transmission: "Automatic",
    available: false,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "car-7",
    name: "Toyota Corolla",
    type: "Sedan",
    pricePerDay: 40,
    seats: 5,
    transmission: "Automatic",
    available: true,
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "car-8",
    name: "Kia Picanto",
    type: "City",
    pricePerDay: 25,
    seats: 4,
    transmission: "Manual",
    available: true,
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=600&q=80",
  },
];

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled";

export type Booking = {
  id: string;
  clientName: string;
  car: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  status: BookingStatus;
  totalPrice: number;
};

export const initialBookings: Booking[] = [
  {
    id: "bk-1",
    clientName: "James Sterling",
    car: "Mercedes-Benz C-Class",
    pickupDate: "2026-06-15",
    returnDate: "2026-06-18",
    pickupLocation: "Alger - Houari Boumediene",
    status: "Confirmed",
    totalPrice: 255,
  },
  {
    id: "bk-2",
    clientName: "Elena Rostova",
    car: "Dacia Duster",
    pickupDate: "2026-06-20",
    returnDate: "2026-06-22",
    pickupLocation: "Oran - USTO",
    status: "Pending",
    totalPrice: 90,
  },
  {
    id: "bk-3",
    clientName: "Marcus Vance",
    car: "Hyundai Tucson",
    pickupDate: "2026-06-10",
    returnDate: "2026-06-14",
    pickupLocation: "Constantine",
    status: "Confirmed",
    totalPrice: 240,
  },
  {
    id: "bk-4",
    clientName: "Sarah Jenkins",
    car: "Renault Clio 5",
    pickupDate: "2026-06-05",
    returnDate: "2026-06-07",
    pickupLocation: "Annaba - Centre",
    status: "Cancelled",
    totalPrice: 60,
  },
  {
    id: "bk-5",
    clientName: "David Chen",
    car: "Toyota Corolla",
    pickupDate: "2026-07-01",
    returnDate: "2026-07-05",
    pickupLocation: "Alger - Houari Boumediene",
    status: "Pending",
    totalPrice: 160,
  },
  {
    id: "bk-6",
    clientName: "Victoria Grant",
    car: "Volkswagen Golf 8",
    pickupDate: "2026-06-25",
    returnDate: "2026-06-30",
    pickupLocation: "Oran - USTO",
    status: "Confirmed",
    totalPrice: 250,
  },
  {
    id: "bk-7",
    clientName: "Jonathan Hayes",
    car: "Peugeot 208",
    pickupDate: "2026-06-01",
    returnDate: "2026-06-03",
    pickupLocation: "Tlemcen",
    status: "Cancelled",
    totalPrice: 64,
  },
  {
    id: "bk-8",
    clientName: "Amanda Pierce",
    car: "Kia Picanto",
    pickupDate: "2026-07-10",
    returnDate: "2026-07-12",
    pickupLocation: "Sétif",
    status: "Pending",
    totalPrice: 50,
  },
];
