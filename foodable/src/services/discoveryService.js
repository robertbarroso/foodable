const API_BASE_URL = "http://localhost:5001/api";

export async function searchProducts(zip, radius = 10) {
  const params = new URLSearchParams({
    zip,
    radius: String(radius),
  });

  const response = await fetch(
    `${API_BASE_URL}/discovery?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Unable to retrieve nearby food locations."
    );
  }

  return data;
}