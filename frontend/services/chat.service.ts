export async function sendMessage(message: string) {

  const response = await fetch(
    "http://127.0.0.1:8000/chat",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        user_id: "1234",      // 👈 Add this
        message: message,
      }),
    }
  );

  console.log("Status:", response.status);

  const data = await response.json();

  console.log("Backend Response:", data);

  return data;
}