// ======================================================
// Chat Service
//
// Purpose:
// Handles all chat related API calls
// ======================================================

const BASE_URL = "http://127.0.0.1:8000";

// ======================================================
// Send Message
// ======================================================

export async function sendMessage(
  question: string,
  token: string
) {

  // ============================================
  // Call Chat API
  // ============================================

  const response = await fetch(
    `${BASE_URL}/chat`,
    {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        question,
      }),

    }
  );

  // ============================================
  // Convert Response
  // ============================================

  const result = await response.json();

  // ============================================
  // Error Handling
  // ============================================

  if (!response.ok) {

    throw new Error(
      result.message || "Failed to send message."
    );

  }

  // ============================================
  // Return Result
  // ============================================

  return result;

}