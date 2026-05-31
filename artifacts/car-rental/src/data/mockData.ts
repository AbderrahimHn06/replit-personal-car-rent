export type Car = {
  id: string;
  name: string;
  category: "Luxury Sedan" | "SUV" | "Sports" | "Executive";
  pricePerDay: number;
  seats: number;
  transmission: "Automatic";
  available: boolean;
  imageGradient: string;
};

export const cars: Car[] = [
  {
    id: "car-1",
    name: "Mercedes-Benz S-Class",
    category: "Luxury Sedan",
    pricePerDay: 450,
    seats: 5,
    transmission: "Automatic",
    available: true,
    imageGradient: "from-slate-800 to-slate-900",
  },
  {
    id: "car-2",
    name: "BMW 7 Series",
    category: "Luxury Sedan",
    pricePerDay: 420,
    seats: 5,
    transmission: "Automatic",
    available: true,
    imageGradient: "from-gray-700 to-gray-900",
  },
  {
    id: "car-3",
    name: "Porsche 911 Carrera",
    category: "Sports",
    pricePerDay: 850,
    seats: 2,
    transmission: "Automatic",
    available: false,
    imageGradient: "from-amber-900 to-zinc-900",
  },
  {
    id: "car-4",
    name: "Range Rover Autobiography",
    category: "SUV",
    pricePerDay: 600,
    seats: 5,
    transmission: "Automatic",
    available: true,
    imageGradient: "from-emerald-900 to-stone-900",
  },
  {
    id: "car-5",
    name: "Mercedes-AMG G 63",
    category: "SUV",
    pricePerDay: 750,
    seats: 5,
    transmission: "Automatic",
    available: true,
    imageGradient: "from-neutral-800 to-neutral-900",
  },
  {
    id: "car-6",
    name: "Audi A8",
    category: "Executive",
    pricePerDay: 400,
    seats: 5,
    transmission: "Automatic",
    available: true,
    imageGradient: "from-blue-900 to-slate-900",
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
    car: "Porsche 911 Carrera",
    pickupDate: "2023-11-15",
    returnDate: "2023-11-18",
    pickupLocation: "LAX Airport",
    status: "Confirmed",
    totalPrice: 2550,
  },
  {
    id: "bk-2",
    clientName: "Elena Rostova",
    car: "Mercedes-Benz S-Class",
    pickupDate: "2023-11-20",
    returnDate: "2023-11-22",
    pickupLocation: "Beverly Hills Hotel",
    status: "Pending",
    totalPrice: 900,
  },
  {
    id: "bk-3",
    clientName: "Marcus Vance",
    car: "Range Rover Autobiography",
    pickupDate: "2023-11-10",
    returnDate: "2023-11-14",
    pickupLocation: "Malibu Estate",
    status: "Confirmed",
    totalPrice: 2400,
  },
  {
    id: "bk-4",
    clientName: "Sarah Jenkins",
    car: "BMW 7 Series",
    pickupDate: "2023-11-05",
    returnDate: "2023-11-07",
    pickupLocation: "Downtown Office",
    status: "Cancelled",
    totalPrice: 840,
  },
  {
    id: "bk-5",
    clientName: "David Chen",
    car: "Audi A8",
    pickupDate: "2023-12-01",
    returnDate: "2023-12-05",
    pickupLocation: "LAX Airport",
    status: "Pending",
    totalPrice: 1600,
  },
  {
    id: "bk-6",
    clientName: "Victoria Grant",
    car: "Mercedes-AMG G 63",
    pickupDate: "2023-11-25",
    returnDate: "2023-11-30",
    pickupLocation: "West Hollywood",
    status: "Confirmed",
    totalPrice: 3750,
  },
  {
    id: "bk-7",
    clientName: "Jonathan Hayes",
    car: "Mercedes-Benz S-Class",
    pickupDate: "2023-11-01",
    returnDate: "2023-11-03",
    pickupLocation: "Santa Monica",
    status: "Cancelled",
    totalPrice: 900,
  },
  {
    id: "bk-8",
    clientName: "Amanda Pierce",
    car: "Porsche 911 Carrera",
    pickupDate: "2023-12-10",
    returnDate: "2023-12-12",
    pickupLocation: "LAX Airport",
    status: "Pending",
    totalPrice: 1700,
  },
];
