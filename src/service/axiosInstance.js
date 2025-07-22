import axios from "axios";

// Base URL từ file `.env`
const baseURL = import.meta.env.VITE_BACKEND_URL;
// const baseURL = import.meta.env.VITE_BACKEND_URL_DEPLOY;
const instance = axios.create({
    baseURL: baseURL + "/api/",
});

// Tên key lưu user info trong localStorage
const STORAGE_KEY = "user_info";

// Header để tránh retry lặp lại
const NO_RETRY_HEADER = "x-no-retry";

// Các domain nội bộ để thêm delay (chỉ trong dev)
const isLocalApi = ["127.0.0.1", "localhost"].some((domain) =>
    baseURL.includes(domain)
);

// ⏱️ Delay trong local để dễ debug
const delayIfLocal = () =>
    isLocalApi ? new Promise((res) => setTimeout(res, 200)) : Promise.resolve();

const redirectToLogin = () => {
    clearUserInfo();
    window.location.href = "/login";
};

// 📦 Lấy thông tin user từ localStorage
const getUserInfo = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
};


// 💾 Lưu lại thông tin user vào localStorage
const setUserInfo = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// ❌ Xoá thông tin user khi hết hạn token
const clearUserInfo = () => {
    localStorage.removeItem(STORAGE_KEY);
};

// 🔄 Gửi request refresh token
const refreshToken = async () => {
    const refreshToken = getUserInfo()?.refreshToken;
    const res = await instance.post("/auth/refresh-token", { refreshToken });
    return res?.data;
};

// 🔑 Gắn access token vào header
const setAccessToken = () => {
    const accessToken = getUserInfo()?.accessToken;
    if (accessToken) {
        instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
};

// 🧊 Interceptor Request
instance.interceptors.request.use(
    async (config) => {
        setAccessToken();
        return config;
    },
    (error) => Promise.reject(error)
);

// 🔥 Interceptor Response
instance.interceptors.response.use(
    async (response) => {
        await delayIfLocal();
        return response?.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // ❗ Nếu 401 và chưa retry lần nào
        if (
            error.response?.status === 401 &&
            !originalRequest.headers[NO_RETRY_HEADER]
        ) {
            try {
                const data = await refreshToken();
                if (data?.accessToken && data?.refreshToken) {
                    // Lưu lại token mới
                    const newInfo = {
                        ...getUserInfo(),
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                    };
                    setUserInfo(newInfo);

                    // Gắn lại token mới
                    originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
                    originalRequest.headers[NO_RETRY_HEADER] = "true";

                    return instance.request(originalRequest); // gửi lại request
                }
            } catch (refreshError) {
                clearUserInfo();
                redirectToLogin();
            }
        }

        // ❌ Nếu refresh token cũng hết hạn
        if (
            error.response?.status === 400 &&
            originalRequest?.url === "/auth/refresh"
        ) {
            clearUserInfo();
            redirectToLogin();
        }

        await delayIfLocal();

        return Promise.reject(error?.response?.data || error);
    }
);

export default instance;
