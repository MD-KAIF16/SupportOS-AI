const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function getTenantAnalytics(token: string) {
  const response = await fetch(`${BASE_URL}/api/analytics`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch analytics data.");
  }
  return result.data;
}
