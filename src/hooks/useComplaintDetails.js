import { useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";
import socket from "../utils/socket";
import { SOCKET_EVENTS } from "../data/socketConstants";

/**
 * Manage complaint detail state with realtime status updates.
 * @param {string | undefined} complaintId
 * @returns {{
 *   complaint: any,
 *   isLoading: boolean,
 *   errorMessage: string
 * }}
 */
export function useComplaintDetails(complaintId) {
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadComplaint = async () => {
      if (!complaintId) return;
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await mockApi.complaintById(complaintId);
        if (isMounted) setComplaint(response);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error?.message || "Unable to load complaint details.");
          setComplaint(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    void loadComplaint();
    return () => {
      isMounted = false;
    };
  }, [complaintId]);

  useEffect(() => {
    if (!complaintId) return;
    socket.connect();
    socket.emit(SOCKET_EVENTS.JOIN_COMPLAINT, complaintId);

    const handleStatusUpdated = (data) => {
      if (data.id === complaintId) {
        setComplaint((previous) =>
          previous
            ? { ...previous, status: data.status, history: data.history }
            : previous,
        );
      }
    };

    socket.on(SOCKET_EVENTS.STATUS_UPDATED, handleStatusUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.STATUS_UPDATED, handleStatusUpdated);
      socket.disconnect();
    };
  }, [complaintId]);

  return { complaint, isLoading, errorMessage };
}
