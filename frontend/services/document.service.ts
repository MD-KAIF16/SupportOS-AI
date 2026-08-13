const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function getDocuments(token: string) {
  const response = await fetch(`${BASE_URL}/documents/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || result.message || "Failed to fetch documents.");
  }
  return result;
}

export async function uploadDocumentFile(file: File, title: string, token: string) {
  const formData = new FormData();
  formData.append("file", file);
  if (title) {
    formData.append("title", title);
  }

  const response = await fetch(`${BASE_URL}/documents/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || result.message || "Failed to upload document file.");
  }
  return result;
}

export async function createDocumentRaw(title: string, content: string, token: string) {
  const response = await fetch(`${BASE_URL}/documents/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      tenant_id: "00000000-0000-0000-0000-000000000000",
      title,
      content,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || result.message || "Failed to create document.");
  }
  return result;
}

export async function deleteDocument(documentId: string, token: string) {
  const response = await fetch(`${BASE_URL}/documents/${documentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || result.message || "Failed to delete document.");
  }
  return result;
}
