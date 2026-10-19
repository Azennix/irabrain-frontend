import type { AuthSession, AuthUser } from "./types";

const ACCESS_TOKEN_KEY = "irabrain_access_token";
const USER_KEY = "irabrain_user";

function getStorage(
  rememberMe: boolean
): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return rememberMe
    ? localStorage
    : sessionStorage;
}

export function saveSession(
  session: AuthSession,
  rememberMe: boolean = true
): void {
  const storage = getStorage(rememberMe);

  if (!storage) return;

  storage.setItem(
    ACCESS_TOKEN_KEY,
    session.access_token
  );

  storage.setItem(
    USER_KEY,
    JSON.stringify(session.user)
  );

  // Remove the session from the other storage.
  const otherStorage = rememberMe
    ? sessionStorage
    : localStorage;

  otherStorage.removeItem(ACCESS_TOKEN_KEY);
  otherStorage.removeItem(USER_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ??
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser =
    localStorage.getItem(USER_KEY) ??
    sessionStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
}

export function getSession(): AuthSession | null {
  const accessToken = getAccessToken();
  const user = getCurrentUser();

  if (!accessToken || !user) {
    return null;
  }

  return {
    access_token: accessToken,
    token_type: "bearer",
    user,
  };
}

export function clearSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}