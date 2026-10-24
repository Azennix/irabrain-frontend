"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import {
  clearSession,
  getAccessToken,
  getCurrentUser,
  saveSession,
} from "./session";

import type {
  AuthSession,
  AuthUser,
} from "./types";

import {
  login as loginApi,
  verifyLoginCode,
  getCurrentUser as fetchCurrentUser,
  refreshSession,
  logoutApi,
} from "@/services/api/authApi";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;

  loginWithEmailCode: (
    email: string,
    code: string
  ) => Promise<void>;

  loginWithGoogle: (
    session: AuthSession
  ) => void;

  logout: () => void;

  updateUser: (
    user: AuthUser
  ) => void;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  // =====================================================
  // RESTORE SESSION
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const storedToken = getAccessToken();
      const storedUser = getCurrentUser();

      try {
        let activeToken = storedToken;

        if (storedToken && storedUser) {
          try {
            await fetchCurrentUser(storedToken);
          } catch {
            activeToken = null;
          }
        }

        if (!activeToken) {
          const refreshed = await refreshSession();
          activeToken = refreshed.access_token;

          const currentUser = await fetchCurrentUser(activeToken);

          if (cancelled) return;

          const authSession: AuthSession = {
            access_token: activeToken,
            token_type: refreshed.token_type,
            user: currentUser,
          };

          saveSession(authSession, true);
          setToken(activeToken);
          setUser(currentUser);
          return;
        }

        const currentUser = await fetchCurrentUser(activeToken);

        if (cancelled) return;

        const authSession: AuthSession = {
          access_token: activeToken,
          token_type: "bearer",
          user: currentUser,
        };

        saveSession(authSession, Boolean(storedToken && storedUser));
        setToken(activeToken);
        setUser(currentUser);
      } catch {
        if (cancelled) return;

        clearSession();
        setToken(null);
        setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // NORMAL PASSWORD LOGIN
  // =====================================================

  async function login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<void> {
    const session =
      await loginApi(
        email,
        password
      );

    const authSession: AuthSession = {
      access_token:
        session.access_token,

      token_type:
        session.token_type,

      user: session.user,
    };

    saveSession(
      authSession,
      rememberMe
    );

    setToken(
      authSession.access_token
    );

    setUser(
      authSession.user
    );
  }

  // =====================================================
  // PASSWORDLESS EMAIL LOGIN
  // =====================================================

  async function loginWithEmailCode(
    email: string,
    code: string
  ): Promise<void> {
    const session =
      await verifyLoginCode(
        email,
        code
      );

    const authSession: AuthSession = {
      access_token:
        session.access_token,

      token_type:
        session.token_type,

      user: session.user,
    };

    saveSession(
      authSession,
      true
    );

    setToken(
      authSession.access_token
    );

    setUser(
      authSession.user
    );
  }

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const loginWithGoogle =
    useCallback(
      (session: AuthSession): void => {
        saveSession(session);

        setToken(
          session.access_token
        );

        setUser(
          session.user
        );
      },
      []
    );

  // =====================================================
  // UPDATE USER
  // =====================================================

  function updateUser(
    updatedUser: AuthUser
  ) {
    setUser(updatedUser);
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  function logout() {
    clearSession();
    setToken(null);
    setUser(null);

    void logoutApi().catch(() => {
      // Local logout is complete even if the server is unreachable.
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,

        isAuthenticated:
          !!user && !!token,

        isLoading,

        login,
        loginWithEmailCode,
        loginWithGoogle,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// USE AUTH
// =====================================================

export function useAuth(): AuthContextValue {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}