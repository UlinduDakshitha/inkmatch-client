import { normalizeRole } from "@/utils/appData";

export function getRoleHomePath(role?: string): string {
  const normalizedRole = normalizeRole(role);

  switch (normalizedRole) {
    case "ADMIN":
      return "/admin";
    case "ARTIST":
      return "/artists";
    case "STUDIO_OWNER":
      return "/studios";
    case "CUSTOMER":
    default:
      return "/dashboard";
  }
}
