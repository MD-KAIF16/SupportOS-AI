// ======================================================
// Ticket Service
//
// Purpose:
// Handles all Ticket related API calls
// ======================================================

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ======================================================
// Get User Tickets
// ======================================================

export async function getTickets(
  token: string
) {

  const response = await fetch(
    `${BASE_URL}/tickets`,
    {

      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },

    }
  );

  const result = await response.json();

  if (!response.ok) {

    throw new Error(
      result.message || "Failed to fetch tickets."
    );

  }

  return result;

}

// ======================================================
// Create Ticket
// ======================================================

export async function createTicket(
  title: string,
  description: string,
  token: string
) {

  const response = await fetch(
    `${BASE_URL}/tickets`,
    {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        title,
        description,
      }),

    }
  );

  const result = await response.json();

  if (!response.ok) {

    throw new Error(
      result.message || "Failed to create ticket."
    );

  }

  return result;

}