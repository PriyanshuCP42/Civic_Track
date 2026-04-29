import { useContext } from "react";
import { AuthContext } from "./authContextObject";

/**
 * Access authentication context state and actions.
 * @returns {any}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
