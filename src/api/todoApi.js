import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://eloquent-mochi-309d45.netlify.app',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    if (config.url && config.url.includes('/todo/login')) {
        return config;
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
        return Promise.reject(new Error('未認証状態のためAPIの利用を拒否しました'));
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
