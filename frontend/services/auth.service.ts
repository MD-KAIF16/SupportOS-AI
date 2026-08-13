// ======================================================
// Authentication Service
//
// Purpose:
// Handles all authentication related API calls
// ======================================================

// ------------------------------------------------------
// Backend Base URL
// ------------------------------------------------------

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ------------------------------------------------------
// Login API
// ------------------------------------------------------

export async function login(
  email: string,
  password: string
) {

  // --------------------------------------------
  // Send Login Request
  // --------------------------------------------

  const response = await fetch(
    `${BASE_URL}/api/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  // --------------------------------------------
  // Convert Response
  // --------------------------------------------

  const result = await response.json();

  // --------------------------------------------
  // Check Error
  // --------------------------------------------

  if (!response.ok) {
    throw new Error(
      result.message || "Login Failed"
    );
  }

  // --------------------------------------------
  // Return Backend Response
  // --------------------------------------------

  return result;
}

// ------------------------------------------------------
// Get Current Logged In User
// ------------------------------------------------------

export async function getCurrentUser(
  token: string
) {

  const response = await fetch(
    `${BASE_URL}/api/user/me`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // --------------------------------------------
  // Check Error
  // --------------------------------------------

  if (!response.ok) {
    throw new Error("Session Expired");
  }

  // --------------------------------------------
  // Return User
  // --------------------------------------------

  return await response.json();
}