import { useCallback, useEffect, useState } from "react";
import { complaintApi } from "../api/complaintApi";

/**
 * Manage complaints assigned to an employee.
 * @param {string | undefined} employeeId
 * @returns {{
 *   complaints: any[],
 *   isLoading: boolean,
 *   errorMessage: string,
 *   reload: () => Promise<void>,
 *   setComplaints: import("react").Dispatch<import("react").SetStateAction<any[]>>
 * }}
 */
export function useEmployeeComplaints(employeeId) {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const reload = useCallback(async () => {
    if (!employeeId) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await complaintApi.employeeComplaints(employeeId);
      setComplaints(response);
    } catch (error) {
      setErrorMessage(error?.message || "Unable to load assigned complaints.");
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { complaints, isLoading, errorMessage, reload, setComplaints };
}
