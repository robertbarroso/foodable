const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "Grocery request failed");
  }

  return data;
}

export async function listGroceryLists() {
  return apiRequest("/groceries");
}

export async function getGroceryList(listId) {
  return apiRequest(`/groceries/${encodeURIComponent(listId)}`);
}

export async function createGroceryList({ title, budget_estimate = null, is_public = false }) {
  return apiRequest("/groceries", {
    method: "POST",
    body: JSON.stringify({
      title,
      is_public,
      budget_estimate,
    }),
  });
}

export async function createGroceryListItem(listId, { name, quantity = null, category = null, price = null }) {
  return apiRequest(`/groceries/${encodeURIComponent(listId)}/items`, {
    method: "POST",
    body: JSON.stringify({
      name,
      quantity,
      category,
      price,
    }),
  });
}

export async function updateGroceryList(listId, updates) {
  return apiRequest(`/groceries/${encodeURIComponent(listId)}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function updateGroceryListItem(listId, itemId, updates) {
  return apiRequest(
    `/groceries/${encodeURIComponent(listId)}/items/${encodeURIComponent(itemId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    },
  );
}

export async function deleteGroceryListItem(listId, itemId) {
  return apiRequest(
    `/groceries/${encodeURIComponent(listId)}/items/${encodeURIComponent(itemId)}`,
    { method: "DELETE" },
  );
}

export async function deleteGroceryList(listId) {
  return apiRequest(`/groceries/${encodeURIComponent(listId)}`, {
    method: "DELETE",
  });
}
