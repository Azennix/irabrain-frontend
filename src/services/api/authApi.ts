const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface User {
  user_id: number;
  full_name: string | null;
  email: string;
  is_active: boolean;
  google_connected: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}
export interface RequestEmailCodeResponse {
  message: string;
  email: string;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || `Login failed: ${response.status}`
    );
  }

  return response.json();
}
export async function requestEmailCode(
  fullName: string,
  email: string
): Promise<RequestEmailCodeResponse> {
  const response = await fetch(
    `${API_BASE_URL}/auth/request-email-code`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ||
        `Unable to send verification code: ${response.status}`
    );
  }

  return response.json();
}

export async function verifyLoginCode(
  email: string,
  code: string
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_BASE_URL}/auth/verify-login-code`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ||
        `Verification failed: ${response.status}`
    );
  }

  return response.json();
}

export async function register(
  fullName: string,
  email: string,
  password: string
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: fullName,
      email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || `Registration failed: ${response.status}`
    );
  }

  return response.json();
}

export interface CheckEmailResponse {
  exists: boolean;
  email_verified?: boolean;
}

export async function checkEmail(
  email: string
): Promise<CheckEmailResponse> {
  const response = await fetch(
    `${API_BASE_URL}/auth/check-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ||
        `Unable to check email: ${response.status}`
    );
  }

  return response.json();
}


export async function getCurrentUser(
  token: string
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status}`);
  }

  return response.json();
}



export async function updateCurrentUser(
  token: string,
  fullName: string,
  email: string
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: fullName,
      email,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ||
        `Unable to update profile: ${response.status}`
    );
  }

  return response.json();
}


// =====================================================
// CHANGE PASSWORD
// =====================================================

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/password`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ||
        `Unable to change password: ${response.status}`
    );
  }

  return response.json();
}


export interface VerifyEmailCodeResponse {
  message: string;
  email: string;
  email_verified: boolean;
}

export async function verifyEmailCode(
  email: string,
  code: string
): Promise<VerifyEmailCodeResponse> {
  const response = await fetch(
    `${API_BASE_URL}/auth/verify-email-code`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ||
        `Email verification failed: ${response.status}`
    );
  }

  return response.json();
}

export interface ResendVerificationResponse {
  message: string;
  email: string;
}

export async function resendVerification(
  email: string
): Promise<ResendVerificationResponse> {
  const response = await fetch(
    `${API_BASE_URL}/auth/resend-verification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ||
        `Unable to resend verification code: ${response.status}`
    );
  }

  return response.json();
}
// =====================================================
// REFRESH SESSION
// =====================================================

export async function refreshSession(): Promise<{ access_token: string; token_type: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Session refresh failed: ${response.status}`);
  }

  return response.json();
}

// =====================================================
// LOGOUT
// =====================================================

export async function logoutApi(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Logout failed: ${response.status}`);
  }
}