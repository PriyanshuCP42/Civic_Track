import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { complaintApi } from "../api/complaintApi";

/**
 * Manage employee directory state and creation actions.
 * @returns {{
 *   employees: any[],
 *   isLoading: boolean,
 *   errorMessage: string,
 *   reload: () => Promise<void>,
 *   createEmployee: (payload: {name: string, email: string, password: string, department: string}) => Promise<{employee: any, source: "remote" | "local"}>
 * }}
 */
export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const reload = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await complaintApi.employees();
      setEmployees(response);
    } catch (error) {
      setErrorMessage(error?.message || "Unable to load employees.");
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEmployee = useCallback(async (payload) => {
    try {
      const created = await adminApi.createEmployee(payload);
      setEmployees((previous) => [created, ...previous]);
      return { employee: created, source: "remote" };
    } catch (error) {
      if (error?.status === 409 || error?.code === "NETWORK") {
        throw error;
      }
      const localCreated = await complaintApi.createEmployee(payload);
      setEmployees((previous) => [localCreated, ...previous]);
      return { employee: localCreated, source: "local" };
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { employees, isLoading, errorMessage, reload, createEmployee };
}
