const KEY = 'wyr_collection';

export function getCollection(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

export function addToCollection(id: string): { collection: string[]; isNew: boolean } {
  const current = getCollection();
  if (current.includes(id)) return { collection: current, isNew: false };
  const updated = [...current, id];
  localStorage.setItem(KEY, JSON.stringify(updated));
  return { collection: updated, isNew: true };
}
