import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://todo-backend-app-o8pw.onrender.com',
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
