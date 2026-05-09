export function getApiBaseUrl() {
  const explicitBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (explicitBase) return explicitBase.replace(/\/$/, "");

  const host = process.env.NEXT_PUBLIC_API_HOST ?? "http://localhost";
  const port =
    process.env.NEXT_PUBLIC_SERVER_PORT ??
    process.env.NEXT_PUBLIC_API_PORT ??
    process.env.NEXT_PUBLIC_PORT;

  if (port) {
    return `${host.replace(/\/$/, "")}:${port}`;
  }

  return "http://localhost:8080";
}
