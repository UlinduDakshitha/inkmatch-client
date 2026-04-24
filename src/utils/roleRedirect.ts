export function getRoleHomePath(role?: string): string {
  const normalizedRole = role?.toUpperCase();

  switch (normalizedRole) {
    case "ADMIN":
      return "/admin";
    case "ARTIST":
    case "TATTOO_ARTIST":
      return "/artists";
    case "STUDIO_OWNER":
    case "STUDIOOWNER":
      return "/studios";
    case "CUSTOMER":
    default:
      return "/dashboard";
  }
}
