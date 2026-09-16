import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://todo-backend-app-kb5o.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    // ログインチェックのガード機能を一時的にスキップして、すべての通信を許可します
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
