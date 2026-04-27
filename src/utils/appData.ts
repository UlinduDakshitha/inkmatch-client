export type AppRole = "CUSTOMER" | "ARTIST" | "STUDIO_OWNER" | "ADMIN";

export type AppUser = {
  name?: string;
  email?: string;
  role?: string;
};

export type AdminProfile = {
  id: string;
  ownerEmail: string;
  ownerName: string;
  phone: string;
  accessNote: string;
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

export type AppNotification = {
  id: string;
  userEmail: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  category: "SYSTEM" | "BOOKING" | "PROMOTION";
};

const ARTIST_KEY = "inkmatch.artistProfiles";
const STUDIO_KEY = "inkmatch.studioProfiles";
const BOOKINGS_KEY = "inkmatch.bookings";
const CUSTOMER_KEY = "inkmatch.customerProfiles";
const ADMIN_KEY = "inkmatch.adminProfiles";
const NOTIFICATIONS_KEY = "inkmatch.notifications";
export const APP_DATA_UPDATED_EVENT = "inkmatch:data-updated";

function notifyAppDataUpdated() {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(APP_DATA_UPDATED_EVENT));
}

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
  const normalized = role
    ?.toUpperCase()
    .replace(/^ROLE_/, "")
    .replace(/[\s-]+/g, "_")
    .trim();

  if (
    normalized === "ARTIST" ||
    normalized === "TATTOO_ARTIST" ||
    normalized === "TATTO_ARTIST" ||
    normalized === "TATTOOARTIST" ||
    normalized === "TATTOARTIST"
  ) {
    return "ARTIST";
  }
  if (
    normalized === "STUDIO_OWNER" ||
    normalized === "STUDIOOWNER" ||
    normalized === "STUDIO-OWNER"
  ) {
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
  notifyAppDataUpdated();
  return next;
}

export function deleteArtistProfileByOwner(
  ownerEmail: string,
): ArtistProfile[] {
  if (typeof window === "undefined") {
    return [];
  }

  const next = getArtistProfiles().filter(
    (item) => item.ownerEmail !== ownerEmail,
  );
  localStorage.setItem(ARTIST_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
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
  notifyAppDataUpdated();
  return next;
}

export function deleteStudioProfileByOwner(
  ownerEmail: string,
): StudioProfile[] {
  if (typeof window === "undefined") {
    return [];
  }

  const next = getStudioProfiles().filter(
    (item) => item.ownerEmail !== ownerEmail,
  );
  localStorage.setItem(STUDIO_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
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
  notifyAppDataUpdated();
  return next;
}

export function deleteBookingById(bookingId: string): Booking[] {
  if (typeof window === "undefined") {
    return [];
  }

  const next = getBookings().filter((item) => item.id !== bookingId);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
  return next;
}

export function deleteBookingsByCustomer(customerEmail: string): Booking[] {
  if (typeof window === "undefined") {
    return [];
  }

  const normalizedEmail = customerEmail.toLowerCase();
  const next = getBookings().filter(
    (item) => item.customerEmail.toLowerCase() !== normalizedEmail,
  );
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
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
  notifyAppDataUpdated();
  return next;
}

export function deleteCustomerProfileByOwner(
  ownerEmail: string,
): CustomerProfile[] {
  if (typeof window === "undefined") {
    return [];
  }

  const next = getCustomerProfiles().filter(
    (item) => item.ownerEmail !== ownerEmail,
  );
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
  return next;
}

export function getAdminProfiles(): AdminProfile[] {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParse<AdminProfile[]>(localStorage.getItem(ADMIN_KEY), []);
}

export function getAdminProfileByOwner(
  ownerEmail: string,
): AdminProfile | null {
  const profile = getAdminProfiles().find(
    (item) => item.ownerEmail.toLowerCase() === ownerEmail.toLowerCase(),
  );
  return profile ?? null;
}

export function upsertAdminProfile(profile: AdminProfile): AdminProfile[] {
  if (typeof window === "undefined") {
    return [];
  }

  const current = getAdminProfiles();
  const index = current.findIndex((item) => item.id === profile.id);
  const next = [...current];

  if (index >= 0) {
    next[index] = profile;
  } else {
    next.unshift(profile);
  }

  localStorage.setItem(ADMIN_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
  return next;
}

export function deleteAdminProfileByOwner(ownerEmail: string): AdminProfile[] {
  if (typeof window === "undefined") {
    return [];
  }

  const next = getAdminProfiles().filter(
    (item) => item.ownerEmail.toLowerCase() !== ownerEmail.toLowerCase(),
  );
  localStorage.setItem(ADMIN_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
  return next;
}

export function getNotifications(): AppNotification[] {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParse<AppNotification[]>(
    localStorage.getItem(NOTIFICATIONS_KEY),
    [],
  );
}

export function getNotificationsByUser(userEmail: string): AppNotification[] {
  const normalizedEmail = userEmail.toLowerCase();
  return getNotifications()
    .filter((item) => item.userEmail.toLowerCase() === normalizedEmail)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function getUnreadNotificationsCount(userEmail: string): number {
  return getNotificationsByUser(userEmail).filter((item) => !item.isRead)
    .length;
}

export function addNotification(
  notification: Omit<AppNotification, "id" | "createdAt">,
): AppNotification[] {
  if (typeof window === "undefined") {
    return [];
  }

  const nextItem: AppNotification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  const next = [nextItem, ...getNotifications()];
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
  return next;
}

export function markNotificationAsRead(
  userEmail: string,
  notificationId: string,
): AppNotification[] {
  if (typeof window === "undefined") {
    return [];
  }

  const normalizedEmail = userEmail.toLowerCase();
  const next = getNotifications().map((item) => {
    if (
      item.id === notificationId &&
      item.userEmail.toLowerCase() === normalizedEmail
    ) {
      return { ...item, isRead: true };
    }
    return item;
  });

  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
  return next;
}

export function markAllNotificationsAsRead(
  userEmail: string,
): AppNotification[] {
  if (typeof window === "undefined") {
    return [];
  }

  const normalizedEmail = userEmail.toLowerCase();
  const next = getNotifications().map((item) => {
    if (item.userEmail.toLowerCase() === normalizedEmail) {
      return { ...item, isRead: true };
    }
    return item;
  });

  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
  return next;
}

export function deleteNotification(
  userEmail: string,
  notificationId: string,
): AppNotification[] {
  if (typeof window === "undefined") {
    return [];
  }

  const normalizedEmail = userEmail.toLowerCase();
  const next = getNotifications().filter(
    (item) =>
      !(
        item.id === notificationId &&
        item.userEmail.toLowerCase() === normalizedEmail
      ),
  );

  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
  return next;
}

export function deleteNotificationById(
  notificationId: string,
): AppNotification[] {
  if (typeof window === "undefined") {
    return [];
  }

  const next = getNotifications().filter((item) => item.id !== notificationId);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
  return next;
}

export function deleteNotificationsByUser(
  userEmail: string,
): AppNotification[] {
  if (typeof window === "undefined") {
    return [];
  }

  const normalizedEmail = userEmail.toLowerCase();
  const next = getNotifications().filter(
    (item) => item.userEmail.toLowerCase() !== normalizedEmail,
  );
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
  return next;
}

export function clearReadNotifications(userEmail: string): AppNotification[] {
  if (typeof window === "undefined") {
    return [];
  }

  const normalizedEmail = userEmail.toLowerCase();
  const next = getNotifications().filter(
    (item) =>
      !(item.userEmail.toLowerCase() === normalizedEmail && item.isRead),
  );

  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
  notifyAppDataUpdated();
  return next;
}

export function ensureWelcomeNotification(user: AppUser): AppNotification[] {
  if (typeof window === "undefined" || !user.email) {
    return [];
  }

  const normalizedEmail = user.email.toLowerCase();
  const existing = getNotifications().some(
    (item) =>
      item.userEmail.toLowerCase() === normalizedEmail &&
      item.category === "SYSTEM" &&
      item.title === "Welcome to InkMatch",
  );

  if (existing) {
    return getNotifications();
  }

  return addNotification({
    userEmail: normalizedEmail,
    title: "Welcome to InkMatch",
    message:
      "Manage your alerts here. New bookings and updates will appear in this feed.",
    isRead: false,
    category: "SYSTEM",
  });
}
