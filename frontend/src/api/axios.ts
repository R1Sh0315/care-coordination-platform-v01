import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

const decodeToken = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
};

// Request interceptor for adding the bearer token
api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('token');

        // Skip token refresh logic if hitting auth routes
        if (config.url?.startsWith('/auth')) {
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        }

        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.exp) {
                const currentTime = Math.floor(Date.now() / 1000);
                // Refresh if token expires in less than 60 seconds
                if (decoded.exp - currentTime < 60) {
                    if (!isRefreshing) {
                        isRefreshing = true;
                        const refreshToken = localStorage.getItem('refreshToken');
                        if (refreshToken) {
                            try {
                                const response = await axios.post(`${config.baseURL || api.defaults.baseURL}/auth/refresh`, { refreshToken });
                                const newToken = response.data.token;
                                const newRefreshToken = response.data.refreshToken;
                                
                                localStorage.setItem('token', newToken);
                                localStorage.setItem('refreshToken', newRefreshToken);
                                token = newToken;
                                onRefreshed(newToken);
                            } catch (error) {
                                localStorage.removeItem('token');
                                localStorage.removeItem('refreshToken');
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            } finally {
                                isRefreshing = false;
                            }
                        } else {
                            isRefreshing = false;
                        }
                    } else {
                        // Wait for the token refresh to complete
                        try {
                            token = await new Promise<string>((resolve) => {
                                subscribeTokenRefresh((newToken) => {
                                    resolve(newToken);
                                });
                            });
                        } catch (e) {
                            // Proceed without token if wait fails
                        }
                    }
                }
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling common errors (like 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && window.location.pathname !== '/login') {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
