export function getEntityId(entity) {
  if (!entity) return "";
  // Since you control the backend, you know it always returns _id
  return String(entity._id);
}

export function extractArray(response) {
  if (!response) return [];

  // Your backend consistently returns { data: [...] }
  const resData = response.data;
  if (Array.isArray(resData)) return resData;
  if (resData && Array.isArray(resData.list)) return resData.list;
  return [];
}

export function extractItem(response, preferredKeys = []) {
  if (!response) return null;
  
  // Your backend consistently returns { data: { item: {...} } }
  const data = response.data;

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

  return data || null;
}
