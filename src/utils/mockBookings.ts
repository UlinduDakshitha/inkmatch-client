export interface MockBooking {
  id: number;
  customerId?: string | number;
  customer?: { fullName: string; email?: string };
  artistId?: string | number;
  studioId?: string | number;
  artist?: { fullName?: string; email?: string };
  studio?: { name?: string; email?: string };
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "COMPLETED";
  createdAt?: string;
}

export function getMockArtistBookings(): MockBooking[] {
  return [
    {
      id: 101,
      customerId: "cust-1",
      customer: { fullName: "Ayesha Perera", email: "ayesha@example.com" },
      date: new Date().toISOString().split("T")[0],
      time: "10:00 AM",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    },
    {
      id: 102,
      customerId: "cust-2",
      customer: { fullName: "Kamal Silva", email: "kamal@example.com" },
      date: new Date().toISOString().split("T")[0],
      time: "1:00 PM",
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    },
  ];
}

export function getMockStudioBookings(): MockBooking[] {
  return [
    {
      id: 201,
      customerId: "cust-3",
      customer: { fullName: "Nimal Fernando", email: "nimal@example.com" },
      date: new Date().toISOString().split("T")[0],
      time: "11:30 AM",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    },
  ];
}

export function getMockCustomerBookings(): MockBooking[] {
  return [
    {
      id: 301,
      artistId: "artist-1",
      artist: { fullName: "Ravi Tattoo", email: "ravi@example.com" },
      date: new Date().toISOString().split("T")[0],
      time: "3:00 PM",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    },
  ];
}
