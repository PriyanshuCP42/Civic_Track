import { useCallback, useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";

/**
 * Manage global complaints dataset state.
 * @returns {{
 *   complaints: any[],
 *   isLoading: boolean,
 *   errorMessage: string,
 *   reload: () => Promise<void>,
 *   setComplaints: import("react").Dispatch<import("react").SetStateAction<any[]>>
 * }}
 */
export function useAllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const reload = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await mockApi.allComplaints();
      setComplaints(response);
    } catch (error) {
      setErrorMessage(error?.message || "Unable to load complaints.");
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { complaints, isLoading, errorMessage, reload, setComplaints };
}
