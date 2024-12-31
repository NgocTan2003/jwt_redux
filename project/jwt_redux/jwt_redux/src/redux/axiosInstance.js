import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "https://localhost:7099";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Hàm kiểm tra token hết hạn
const isTokenExpired = (token) => {
    if (!token) return true;
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return decoded.exp * 1000 < Date.now();
};

// Interceptor để thêm Authorization header và làm mới token nếu cần
axiosInstance.interceptors.request.use(async (config) => {
    let accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (isTokenExpired(accessToken)) {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/Token/RefreshToken`, {
                AccessToken: accessToken,
                RefreshToken: refreshToken,
            });

            if (response.data && response.data.statusCode === 200) {
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
                Cookies.set("accessToken", newAccessToken, { secure: true, sameSite: "Strict" });
                Cookies.set("refreshToken", newRefreshToken, { secure: true, sameSite: "Strict" });
                accessToken = newAccessToken;
            } else if (response.data && response.data.statusCode === 401) {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Failed to refresh token", error);
            return Promise.reject(new Error("Failed to refresh token"));
        }
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
