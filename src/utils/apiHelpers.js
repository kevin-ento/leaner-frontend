export function getEntityId(entity) {
  if (!entity) return "";
  const id = entity._id ?? entity.id ?? entity;
  return String(id);
}

export function extractArray(response) {
  if (!response) return [];

  const resData = response.data ?? response;
  if (Array.isArray(resData)) return resData;
  if (resData && Array.isArray(resData.list)) return resData.list;
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
