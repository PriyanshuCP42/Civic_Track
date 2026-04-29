import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth as useClerkAuth, useClerk, useUser } from "@clerk/clerk-react";
import { AUTH_CONSTANTS } from "../data/authConstants";
import { ROLES, ROLE_VALUES } from "../data/roleConstants";
import { AuthContext } from "./authContextObject";

const normalizeRole = (value) => {
  if (!value || typeof value !== "string") return null;
  const lower = value.toLowerCase();
  return ROLE_VALUES.includes(lower) ? lower : null;
};

const deriveRole = (clerkUser) => {
  const email = clerkUser?.primaryEmailAddress?.emailAddress?.toLowerCase() || "";
  if (email === AUTH_CONSTANTS.ADMIN_EMAIL) return ROLES.ADMIN;
  return normalizeRole(clerkUser?.publicMetadata?.role) || ROLES.CITIZEN;
};

export const AuthProvider = ({ children }) => {
  const clerk = useClerk();
  const { getToken } = useClerkAuth();
  const { user: clerkUser, isLoaded } = useUser();
  const [token, setToken] = useState(null);
  const [profilePatch, setProfilePatch] = useState({});
  const [manualUser, setManualUser] = useState(null);

  useEffect(() => {
    const syncToken = async () => {
      if (!clerkUser) {
        setToken(null);
        return;
      }
      const sessionToken = await getToken();
      setToken(sessionToken || null);
    };
    syncToken();
  }, [clerkUser, getToken]);

  useEffect(() => {
    window.__sccmsToken = token;
  }, [token]);

  const user = useMemo(() => {
    if (manualUser) return manualUser;
    if (!clerkUser) return null;

    const metadataRole = deriveRole(clerkUser);
    const baseUser = {
      id: clerkUser.id,
      clerkId: clerkUser.id,
      name: clerkUser.fullName || clerkUser.firstName || "User",
      email: clerkUser.primaryEmailAddress?.emailAddress || "",
      role: metadataRole,
      department: clerkUser.publicMetadata?.department || "",
      joinedAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : new Date().toISOString(),
    };

    return { ...baseUser, ...profilePatch };
  }, [manualUser, clerkUser, profilePatch]);

  const logout = useCallback(async () => {
    setManualUser(null);
    setProfilePatch({});
    if (clerkUser) await clerk.signOut();
  }, [clerk, clerkUser]);

  const setUser = useCallback((nextUser) => {
    setProfilePatch((prev) => ({ ...prev, ...nextUser }));
  }, []);

  const completeRoleOnboarding = useCallback(async ({ role, department }) => {
    setProfilePatch((prev) => ({
      ...prev,
      role,
      department: role === ROLES.EMPLOYEE ? department || "" : "",
    }));
  }, []);

  const loginWithHardcodedAdmin = useCallback(({ email, password }) => {
    const normalizedEmail = email?.trim().toLowerCase();
    if (
      normalizedEmail !== AUTH_CONSTANTS.ADMIN_EMAIL ||
      password !== AUTH_CONSTANTS.ADMIN_PASSWORD
    ) {
      return false;
    }
    setManualUser({
      id: "hardcoded-admin",
      clerkId: "hardcoded-admin",
      name: "Admin",
      email: AUTH_CONSTANTS.ADMIN_EMAIL,
      role: ROLES.ADMIN,
      department: "",
      joinedAt: new Date().toISOString(),
    });
    setToken(AUTH_CONSTANTS.HARDCODED_ADMIN_TOKEN);
    return true;
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading: !isLoaded,
      logout,
      setUser,
      isAuthenticated: Boolean(user),
      completeRoleOnboarding,
      hasCompletedOnboarding: true,
      loginWithHardcodedAdmin,
    }),
    [
      completeRoleOnboarding,
      isLoaded,
      loginWithHardcodedAdmin,
      logout,
      setUser,
      token,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
