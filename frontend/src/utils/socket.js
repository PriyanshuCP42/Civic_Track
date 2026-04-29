import { io } from "socket.io-client";
import { SOCKET_URL } from "../api/apiConfig";

const socket = io(SOCKET_URL, { autoConnect: false });

export default socket;
