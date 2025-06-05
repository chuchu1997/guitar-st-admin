/** @format */
import { AuthStorage } from "@/utils/authLocalstorage";
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  timeout: 10000, // Thời gian timeout là 10 giây
});

// Gắn request interceptor
api.interceptors.request.use(
  (config) => {
    const access_token =
      typeof window !== "undefined" ? AuthStorage.getToken() : null;

    if (access_token && config.headers) {
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }

    // GẮN TOKEN VÀO HEADER CỦA TẤT CẢ CÁC REQUEST
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Đã có lỗi xảy ra";

    switch (status) {
      case 400:
        if (typeof window !== "undefined") {
          toast.error(`⛔  ${message}`);
        }

        // Ví dụ: hiển thị toast
        // toast.error("Dữ liệu gửi lên không hợp lệ");
        break;

      case 401:
        if (typeof window !== "undefined") {
          console.log(`🚫 401 Error: ${message}`);
          AuthStorage.removeToken();
        }
        // AuthStorage.removeToken();
        break;

      case 403:
        if (typeof window !== "undefined") {
          toast.error(`🚫 ${message}`);
        }

        // toast.error("Bạn không có quyền truy cập");
        break;

      case 500:
        // if (typeof window !== "undefined") {
        //   toast.error(`💥 500 Server Error :${message}`);
        // }
        break;
      default:
        console.error("🌐 Unknown Error:", message);
        // toast.error(message);
        break;
    }
    return Promise.reject(error);
  }
);

export default api;
