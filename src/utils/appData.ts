export type AppRole = "CUSTOMER" | "ARTIST" | "STUDIO_OWNER" | "ADMIN";

export type AppUser = {
  name?: string;
  email?: string;
  role?: string;
};

export type ArtistProfile = {
  id: string;
  ownerEmail: string;
  ownerName: string;
  style: string;
  bio: string;
  location: string;
  rateRange: string;
  profileImage?: string;
  galleryImages: string[];
};

export type StudioProfile = {
  id: string;
  ownerEmail: string;
  ownerName: string;
  name: string;
  address: string;
  description: string;
  profileImage?: string;
  galleryImages: string[];
};

export type Booking = {
  id: string;
  customerEmail: string;
  customerName: string;
  targetType: "ARTIST" | "STUDIO";
  targetId: string;
  targetName: string;
  appointmentDate: string;
  notes: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
};

export type CustomerProfile = {
  id: string;
  ownerEmail: string;
  ownerName: string;
  phone: string;
  city: string;
  bio: string;
};

const ARTIST_KEY = "inkmatch.artistProfiles";
const STUDIO_KEY = "inkmatch.studioProfiles";
const BOOKINGS_KEY = "inkmatch.bookings";
const CUSTOMER_KEY = "inkmatch.customerProfiles";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function normalizeRole(role?: string): AppRole {
  const normalized = role?.toUpperCase();
  if (normalized === "ARTIST" || normalized === "TATTOO_ARTIST") {
    return "ARTIST";
  }
  if (normalized === "STUDIO_OWNER" || normalized === "STUDIOOWNER") {
    return "STUDIO_OWNER";
  }
  if (normalized === "ADMIN") {
    return "ADMIN";
  }
  return "CUSTOMER";
}

export function getCurrentUser(): AppUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  return safeParse<AppUser | null>(localStorage.getItem("user"), null);
}

export function getArtistProfiles(): ArtistProfile[] {
  if (typeof window === "undefined") {
    return [];
  }

  const parsed = safeParse<ArtistProfile[]>(
    localStorage.getItem(ARTIST_KEY),
    [],
  );
  return parsed.map((item) => ({
    ...item,
    profileImage: item.profileImage || "",
    galleryImages: Array.isArray(item.galleryImages) ? item.galleryImages : [],
  }));
}

export function getArtistProfileById(id: string): ArtistProfile | null {
  const profile = getArtistProfiles().find((item) => item.id === id);
  return profile ?? null;
}

export function getArtistProfileByOwner(
  ownerEmail: string,
): ArtistProfile | null {
  const profile = getArtistProfiles().find(
    (item) => item.ownerEmail === ownerEmail,
  );
  return profile ?? null;
}

export function upsertArtistProfile(profile: ArtistProfile): ArtistProfile[] {
  if (typeof window === "undefined") {
    return [];
  }

  const current = getArtistProfiles();
  const normalizedProfile: ArtistProfile = {
    ...profile,
    profileImage: profile.profileImage || "",
    galleryImages: Array.isArray(profile.galleryImages)
      ? profile.galleryImages
      : [],
  };
  const index = current.findIndex((item) => item.id === normalizedProfile.id);
  const next = [...current];

  if (index >= 0) {
    next[index] = normalizedProfile;
  } else {
    next.unshift(normalizedProfile);
  }

  localStorage.setItem(ARTIST_KEY, JSON.stringify(next));
  return next;
}

export function getStudioProfiles(): StudioProfile[] {
  if (typeof window === "undefined") {
    return [];
  }

  const parsed = safeParse<StudioProfile[]>(
    localStorage.getItem(STUDIO_KEY),
    [],
  );
  return parsed.map((item) => ({
    ...item,
    profileImage: item.profileImage || "",
    galleryImages: Array.isArray(item.galleryImages) ? item.galleryImages : [],
  }));
}

export function getStudioProfileById(id: string): StudioProfile | null {
  const profile = getStudioProfiles().find((item) => item.id === id);
  return profile ?? null;
}

export function getStudioProfileByOwner(
  ownerEmail: string,
): StudioProfile | null {
  const profile = getStudioProfiles().find(
    (item) => item.ownerEmail === ownerEmail,
  );
  return profile ?? null;
}

export function upsertStudioProfile(profile: StudioProfile): StudioProfile[] {
  if (typeof window === "undefined") {
    return [];
  }

  const current = getStudioProfiles();
  const normalizedProfile: StudioProfile = {
    ...profile,
    profileImage: profile.profileImage || "",
    galleryImages: Array.isArray(profile.galleryImages)
      ? profile.galleryImages
      : [],
  };
  const index = current.findIndex((item) => item.id === normalizedProfile.id);
  const next = [...current];

  if (index >= 0) {
    next[index] = normalizedProfile;
  } else {
    next.unshift(normalizedProfile);
  }

  localStorage.setItem(STUDIO_KEY, JSON.stringify(next));
  return next;
}

export function getBookings(): Booking[] {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParse<Booking[]>(localStorage.getItem(BOOKINGS_KEY), []);
}

export function getBookingsForCustomer(customerEmail: string): Booking[] {
  return getBookings().filter((item) => item.customerEmail === customerEmail);
}

export function addBooking(booking: Booking): Booking[] {
  if (typeof window === "undefined") {
    return [];
  }

  const next = [booking, ...getBookings()];
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
  return next;
}

export function getCustomerProfiles(): CustomerProfile[] {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParse<CustomerProfile[]>(localStorage.getItem(CUSTOMER_KEY), []);
}

export function getCustomerProfileByOwner(
  ownerEmail: string,
): CustomerProfile | null {
  const profile = getCustomerProfiles().find(
    (item) => item.ownerEmail === ownerEmail,
  );
  return profile ?? null;
}

export function upsertCustomerProfile(
  profile: CustomerProfile,
): CustomerProfile[] {
  if (typeof window === "undefined") {
    return [];
  }

  const current = getCustomerProfiles();
  const index = current.findIndex((item) => item.id === profile.id);
  const next = [...current];

  if (index >= 0) {
    next[index] = profile;
  } else {
    next.unshift(profile);
  }

  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(next));
  return next;
}
