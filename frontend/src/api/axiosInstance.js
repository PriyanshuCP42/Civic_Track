import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  if (window.__sccmsToken) {
    config.headers.Authorization = `Bearer ${window.__sccmsToken}`;
  }
  return config;
});

export default axiosInstance;
