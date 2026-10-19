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
    async function restoreSession() {
      const storedToken =
        getAccessToken();

      const storedUser =
        getCurrentUser();

      if (!storedToken || !storedUser) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser =
          await fetchCurrentUser(
            storedToken
          );

        setToken(storedToken);
        setUser(currentUser);
      } catch {
        clearSession();

        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
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