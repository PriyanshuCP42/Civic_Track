import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
});

axiosInstance.interceptors.request.use((config) => {
  if (window.__sccmsToken) {
    config.headers.Authorization = `Bearer ${window.__sccmsToken}`;
  }
  return config;
});

export default axiosInstance;
