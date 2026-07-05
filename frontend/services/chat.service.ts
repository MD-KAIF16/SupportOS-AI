// ====================================
// Send Message To FastAPI Backend
// ====================================

export async function sendMessage(message: string) {

  const response = await fetch(
    "http://127.0.0.1:8000/chat",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        user_id: "1234",
        message: message,
      }),
    }
  );

  // Backend error
  if (!response.ok) {
    throw new Error("Backend Error");
  }

  // JSON Response
  const data = await response.json();

  return data;
}