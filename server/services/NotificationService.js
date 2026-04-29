import { SERVER_CONSTANTS } from "../config/constants.js";
import { getIO } from "../utils/socket.js";

/**
 * Publishes realtime complaint notifications.
 */
export class NotificationService {
  /**
   * Publish the current status and history to the complaint room.
   * @param {any} complaint
   * @returns {void}
   */
  publishComplaintStatusUpdated(complaint) {
    getIO()
      .to(`${SERVER_CONSTANTS.SOCKET.COMPLAINT_ROOM_PREFIX}${complaint.id}`)
      .emit(SERVER_CONSTANTS.SOCKET.STATUS_UPDATED_EVENT, {
        id: complaint.id,
        status: complaint.status,
        history: complaint.history,
      });
  }
}

export const notificationService = new NotificationService();
