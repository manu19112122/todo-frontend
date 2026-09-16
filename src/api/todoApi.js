import axios from 'axios';

const apiClient = axios.create({
    // 環境変数に頼らず、確定しているRenderのURLを直接ここに固定します
    baseURL: 'https://todo-backend-app-kb5o.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
