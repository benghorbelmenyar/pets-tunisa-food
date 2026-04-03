import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Configure x-session-id for anonymous carts
const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
};

// Add interceptor to include JWT and session ID
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Always attach session ID for cart tracking
    config.headers['x-session-id'] = getOrCreateSessionId();

    return config;
}, (error) => {
    return Promise.reject(error);
});
