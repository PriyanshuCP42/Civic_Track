import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth as useClerkAuth, useClerk, useUser } from "@clerk/clerk-react";

const AuthContext = createContext(null);

const normalizeRole = (value) => {
  if (!value || typeof value !== "string") return null;
  const lower = value.toLowerCase();
  return ["citizen", "admin", "employee"].includes(lower) ? lower : null;
};

const deriveRole = (clerkUser) => {
  const adminEmail = "admin@gmail.com";
  const email = clerkUser?.primaryEmailAddress?.emailAddress?.toLowerCase() || "";
  if (email === adminEmail) return "admin";
  return normalizeRole(clerkUser?.publicMetadata?.role) || "citizen";
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

  const logout = async () => {
    setManualUser(null);
    setProfilePatch({});
    if (clerkUser) await clerk.signOut();
  };

  const setUser = (nextUser) => {
    setProfilePatch((prev) => ({ ...prev, ...nextUser }));
  };

  const completeRoleOnboarding = async ({ role, department }) => {
    setProfilePatch((prev) => ({
      ...prev,
      role,
      department: role === "employee" ? department || "" : "",
    }));
  };

  const loginWithHardcodedAdmin = ({ email, password }) => {
    const normalizedEmail = email?.trim().toLowerCase();
    if (normalizedEmail !== "admin@gmail.com" || password !== "Ashmit") return false;
    setManualUser({
      id: "hardcoded-admin",
      clerkId: "hardcoded-admin",
      name: "Admin",
      email: "admin@gmail.com",
      role: "admin",
      department: "",
      joinedAt: new Date().toISOString(),
    });
    setToken("hardcoded-admin-token");
    return true;
  };

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
    [user, token, isLoaded],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
