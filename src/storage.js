export const BOOKS_STORAGE_KEY = 'ideahub-factory-test-books';

export function loadBooks(storage = window.localStorage) {
  try {
    const raw = storage.getItem(BOOKS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every((book) => typeof book === 'string')
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export function saveBooks(books, storage = window.localStorage) {
  try {
    storage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
    return true;
  } catch {
    return false;
  }
}
