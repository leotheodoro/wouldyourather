// Client-only: relies on window.location. Only call from client components.
export function buildShareUrl(id: string): string {
  if (typeof window === "undefined") return `/?result=${id}`;
  const url = new URL(window.location.href);
  url.pathname = "/";
  url.search = "";
  url.searchParams.set("result", id);
  return url.toString();
}
