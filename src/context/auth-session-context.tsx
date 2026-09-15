"use client";

import * as React from "react";
import { User, Organization, ActiveRole } from "@/types/auth";
import { MOCK_ORGANISATIONS, MOCK_ROLES, MOCK_USER } from "@/data/mock-auth";

const STORAGE_KEY = "honey_chain_mock_session_v1";

interface StoredSessionState {
  user: User | null;
  selectedOrgId: string | null;
  selectedRoleId: string | null;
  isAuthenticated: boolean;
}

const DEFAULT_STATE: StoredSessionState = {
  user: null,
  selectedOrgId: null,
  selectedRoleId: null,
  isAuthenticated: false,
};

function readStorage(): StoredSessionState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;
    const parsed = JSON.parse(stored);
    return {
      user: parsed.user || null,
      selectedOrgId: parsed.selectedOrgId || null,
      selectedRoleId: parsed.selectedRoleId || null,
      isAuthenticated: !!parsed.isAuthenticated,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeStorage(state: StoredSessionState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota or security errors
  }
}

// In-memory reactive store
let memoryState: StoredSessionState = DEFAULT_STATE;
const storeListeners = new Set<() => void>();

function updateStore(nextState: Partial<StoredSessionState>) {
  memoryState = {
    ...memoryState,
    ...nextState,
  };
  writeStorage(memoryState);
  storeListeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  storeListeners.add(callback);
  return () => {
    storeListeners.delete(callback);
  };
}

function getSnapshot(): StoredSessionState {
  return memoryState;
}

function getServerSnapshot(): StoredSessionState {
  return DEFAULT_STATE;
}

export interface AuthSessionContextValue {
  user: User | null;
  selectedOrg: Organization | null;
  selectedRole: ActiveRole | null;
  isAuthenticated: boolean;
  hasSelectedOrg: boolean;
  hasSelectedRole: boolean;
  isInitialized: boolean;
  allOrganisations: Organization[];
  allRoles: ActiveRole[];
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  selectOrganisation: (orgId: string) => void;
  selectRole: (roleId: string) => void;
  switchOrganisation: (orgId: string) => void;
  switchRole: (roleId: string) => void;
  logout: () => void;
  resetToDefaultDemo: () => void;
}

const AuthSessionContext = React.createContext<AuthSessionContextValue | undefined>(undefined);

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  // Initialize memory state from localStorage on first client execution
  React.useEffect(() => {
    memoryState = readStorage();
    storeListeners.forEach((listener) => listener());
  }, []);

  const session = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    // Run after mount to signal hydration is complete
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = React.useCallback(
    async (email: string, password?: string) => {
      if (!email || !email.includes("@")) {
        return { success: false, error: "Please enter a valid email address." };
      }
      if (!password || password.trim().length === 0) {
        return { success: false, error: "Please enter your password." };
      }

      const loggedUser: User = {
        ...MOCK_USER,
        email: email.trim(),
        fullName:
          email.toLowerCase() === MOCK_USER.email.toLowerCase()
            ? MOCK_USER.fullName
            : email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      };

      updateStore({
        user: loggedUser,
        isAuthenticated: true,
        selectedOrgId: null,
        selectedRoleId: null,
      });

      return { success: true };
    },
    []
  );

  const selectOrganisation = React.useCallback((orgId: string) => {
    updateStore({
      selectedOrgId: orgId,
      selectedRoleId: null,
    });
  }, []);

  const selectRole = React.useCallback((roleId: string) => {
    updateStore({
      selectedRoleId: roleId,
    });
  }, []);

  const switchOrganisation = React.useCallback(
    (orgId: string) => {
      const org = MOCK_ORGANISATIONS.find((o) => o.id === orgId);
      if (!org) return;

      if (session.selectedRoleId && !org.availableRoleIds.includes(session.selectedRoleId)) {
        const nextRoleId = org.availableRoleIds[0] || "org_admin";
        updateStore({ selectedOrgId: orgId, selectedRoleId: nextRoleId });
      } else {
        updateStore({ selectedOrgId: orgId });
      }
    },
    [session.selectedRoleId]
  );

  const switchRole = React.useCallback((roleId: string) => {
    updateStore({ selectedRoleId: roleId });
  }, []);

  const logout = React.useCallback(() => {
    updateStore({
      user: null,
      selectedOrgId: null,
      selectedRoleId: null,
      isAuthenticated: false,
    });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  }, []);

  const resetToDefaultDemo = React.useCallback(() => {
    updateStore({
      user: MOCK_USER,
      selectedOrgId: MOCK_ORGANISATIONS[0].id,
      selectedRoleId: MOCK_ROLES[0].id,
      isAuthenticated: true,
    });
  }, []);

  const selectedOrg = React.useMemo(() => {
    if (!session.selectedOrgId) return null;
    return MOCK_ORGANISATIONS.find((o) => o.id === session.selectedOrgId) || null;
  }, [session.selectedOrgId]);

  const selectedRole = React.useMemo(() => {
    if (!session.selectedRoleId) return null;
    return MOCK_ROLES.find((r) => r.id === session.selectedRoleId) || null;
  }, [session.selectedRoleId]);

  const value = React.useMemo<AuthSessionContextValue>(() => {
    return {
      user: session.user,
      selectedOrg,
      selectedRole,
      isAuthenticated: session.isAuthenticated,
      hasSelectedOrg: !!selectedOrg,
      hasSelectedRole: !!selectedRole,
      isInitialized: hasMounted,
      allOrganisations: MOCK_ORGANISATIONS,
      allRoles: MOCK_ROLES,
      login,
      selectOrganisation,
      selectRole,
      switchOrganisation,
      switchRole,
      logout,
      resetToDefaultDemo,
    };
  }, [
    session.user,
    session.isAuthenticated,
    selectedOrg,
    selectedRole,
    hasMounted,
    login,
    selectOrganisation,
    selectRole,
    switchOrganisation,
    switchRole,
    logout,
    resetToDefaultDemo,
  ]);

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const context = React.useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used within an AuthSessionProvider");
  }
  return context;
}
