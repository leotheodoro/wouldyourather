export function buildShareUrl(id: string): string {
  const url = new URL(window.location.href);
  url.pathname = '/';
  url.search = '';
  url.searchParams.set('result', id);
  return url.toString();
}
