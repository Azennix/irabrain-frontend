"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AuthModalContextValue {
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthModalContext =
  createContext<AuthModalContextValue | undefined>(
    undefined
  );

interface AuthModalProviderProps {
  children: ReactNode;
}

export function AuthModalProvider({
  children,
}: AuthModalProviderProps) {
  const [authModalOpen, setAuthModalOpen] =
    useState(false);

  function openAuthModal() {
    setAuthModalOpen(true);
  }

  function closeAuthModal() {
    setAuthModalOpen(false);
  }

  return (
    <AuthModalContext.Provider
      value={{
        authModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextValue {
  const context =
    useContext(AuthModalContext);

  if (!context) {
    throw new Error(
      "useAuthModal must be used inside AuthModalProvider"
    );
  }

  return context;
}