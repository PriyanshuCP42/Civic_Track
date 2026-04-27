import { useCallback, useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";

/**
 * Manage citizen complaints collection state.
 * @param {string | undefined} citizenId
 * @returns {{
 *   complaints: any[],
 *   isLoading: boolean,
 *   errorMessage: string,
 *   reload: () => Promise<void>,
 *   setComplaints: import("react").Dispatch<import("react").SetStateAction<any[]>>
 * }}
 */
export function useCitizenComplaints(citizenId) {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const reload = useCallback(async () => {
    if (!citizenId) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await mockApi.meComplaints(citizenId);
      setComplaints(response);
    } catch (error) {
      setErrorMessage(error?.message || "Unable to load complaints.");
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  }, [citizenId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { complaints, isLoading, errorMessage, reload, setComplaints };
}
