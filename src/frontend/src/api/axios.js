import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7099/api",
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(p => {
        if (error) p.reject(error);
        else p.resolve(token);
    });
    failedQueue = [];
};

// Attach access token
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401
api.interceptors.response.use(
    res => res,
    async err => {

        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = "Bearer " + token;
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {

                const refreshResponse = await axios.post(
                    "https://localhost:7099/api/Auth/refresh-token",
                    {
                        accessToken: localStorage.getItem("token"),
                        refreshToken: localStorage.getItem("refreshToken")
                    }
                );

                const newToken = refreshResponse.data.token;
                const newRefresh = refreshResponse.data.refreshToken;

                login(res.data.token, res.data.refreshToken);
                api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

                api.defaults.headers.common["Authorization"] = "Bearer " + newToken;

                processQueue(null, newToken);

                return api(originalRequest);

            } catch (refreshError) {

                processQueue(refreshError, null);

                localStorage.clear();

                // Instead of redirecting immediately,
                // emit logout event and let React handle navigation
                window.dispatchEvent(new Event("auth:logout"));

                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);

export default api;
