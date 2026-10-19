"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type WorkspaceMode = "personal" | "private";

interface WorkspaceContextValue {
  workspaceMode: WorkspaceMode;
  setWorkspaceMode: (mode: WorkspaceMode) => void;
}

const WorkspaceContext =
  createContext<WorkspaceContextValue | null>(null);

const WORKSPACE_STORAGE_KEY =
  "irabrain_workspace_mode";

export function WorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [workspaceMode, setWorkspaceModeState] =
    useState<WorkspaceMode>("personal");

  const [hydrated, setHydrated] =
    useState(false);

  /* =====================================================
     RESTORE WORKSPACE AFTER REFRESH
  ===================================================== */

  useEffect(() => {
    try {
      const saved =
        sessionStorage.getItem(
          WORKSPACE_STORAGE_KEY
        );

      if (
        saved === "personal" ||
        saved === "private"
      ) {
        setWorkspaceModeState(saved);
      }
    } catch (error) {
      console.error(
        "Failed to restore workspace:",
        error
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  /* =====================================================
     CHANGE + PERSIST WORKSPACE
  ===================================================== */

  function setWorkspaceMode(
    mode: WorkspaceMode
  ) {
    setWorkspaceModeState(mode);

    try {
      sessionStorage.setItem(
        WORKSPACE_STORAGE_KEY,
        mode
      );
    } catch (error) {
      console.error(
        "Failed to save workspace:",
        error
      );
    }
  }

  /*
   * Keep the existing app rendering behavior.
   * The saved workspace is restored immediately
   * after hydration.
   */

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceMode: hydrated
          ? workspaceMode
          : "personal",
        setWorkspaceMode,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context =
    useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspace must be used inside WorkspaceProvider"
    );
  }

  return context;
}