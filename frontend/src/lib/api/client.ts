const API_BASE_URL = "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  document.cookie =
    "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (response.status === 401) {
    redirectToLogin();
    throw new ApiError("Session expirée", 401);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      (data as { detail?: string } | null)?.detail ?? "Erreur serveur",
      response.status,
    );
  }

  return data as T;
}
