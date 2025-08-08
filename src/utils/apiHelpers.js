/**
 * Utilities to normalize API responses and entity identifiers across
 * inconsistent backend shapes.
 */

/**
 * Returns a stable string id for an entity that may be an object or a raw id.
 */
export function getEntityId(entity) {
  if (!entity) return "";
  const id = entity._id ?? entity.id ?? entity;
  return String(id);
}

/**
 * Extracts an array from a typical API response shape.
 * Supports: [ ... ], { data: [...] }, { data: { list: [...] } }
 */
export function extractArray(response) {
  if (!response) return [];

  const maybeData = response.data ?? response;
  if (Array.isArray(maybeData)) return maybeData;
  if (maybeData && Array.isArray(maybeData.list)) return maybeData.list;
  return [];
}

/**
 * Extracts a single item from a typical API response shape.
 * Tries common keys, then falls back to data or the response itself.
 */
export function extractItem(response, preferredKeys = []) {
  if (!response) return null;
  const data = response.data ?? response;

  const keyCandidates = [
    ...preferredKeys,
    "item",
    "course",
    "user",
    "enrollment",
    "session",
  ];

  for (const key of keyCandidates) {
    if (data && typeof data === "object" && key in data) {
      return data[key];
    }
  }

  return data ?? null;
}


