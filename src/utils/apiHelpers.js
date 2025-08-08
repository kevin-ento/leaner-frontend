export function getEntityId(entity) {
  if (!entity) return "";
  const id = entity._id ?? entity.id ?? entity;
  return String(id);
}

export function extractArray(response) {
  if (!response) return [];

  const maybeData = response.data ?? response;
  if (Array.isArray(maybeData)) return maybeData;
  if (maybeData && Array.isArray(maybeData.list)) return maybeData.list;
  return [];
}

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
