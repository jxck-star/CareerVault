import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Auth Interceptor
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('career_vault_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(response => {
    const transform = (obj) => {
        if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
            if (obj._id && !obj.id) obj.id = String(obj._id);
            Object.keys(obj).forEach(key => transform(obj[key]));
        } else if (Array.isArray(obj)) {
            obj.forEach(item => transform(item));
        }
    };
    transform(response.data);
    return response;
});

export const authApi = {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData)
};

export const profileApi = {
    get: (userId) => apiClient.get(`/profiles/${userId}`),
    update: (userId, data) => apiClient.put(`/profiles/${userId}`, data),
    getAllAppliers: () => apiClient.get('/profiles/type/applier')
};

export const jobApi = {
    getAll: () => apiClient.get('/jobs'),
    create: (data) => apiClient.post('/jobs', data),
    delete: (id) => apiClient.delete(`/jobs/${id}`)
};

export const applicationApi = {
    getByUser: (userId) => apiClient.get(`/applications/user/${userId}`),
    getAll: () => apiClient.get('/applications'),
    apply: (data) => apiClient.post('/applications', data),
    updateStatus: (id, status, note) => apiClient.put(`/applications/${id}/status`, { status, note }),
    addUpdate: (id, status, note) => apiClient.put(`/applications/${id}/add-update`, { status, note }),
    assignTest: (id, testId) => apiClient.put(`/applications/${id}/assign-test`, { testId }),
    shortlist: (id, shortlisted) => apiClient.put(`/applications/${id}/shortlist`, { shortlisted })
};

export const assessmentApi = {
    getAll: () => apiClient.get('/assessments'),
    create: (data) => apiClient.post('/assessments', data),
    delete: (id) => apiClient.delete(`/assessments/${id}`)
};

export const assessmentResultApi = {
    getByUser: (userId) => apiClient.get(`/assessment-results/user/${userId}`),
    submit: (data) => apiClient.post('/assessment-results', data)
};

export const ticketApi = {
    getByUser: (userId) => apiClient.get(`/tickets/user/${userId}`),
    create: (data) => apiClient.post('/tickets', data),
    update: (id, data) => apiClient.put(`/tickets/${id}`, data)
};

export const adminApi = {
    getUsers: () => apiClient.get('/admin/users'),
    updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
    deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
    getStats: () => apiClient.get('/admin/stats')
};

export const publicApi = {
    getStats: () => apiClient.get('/public/stats')
};

export const notificationApi = {
    getByUser: (userId) => apiClient.get(`/notifications/user/${userId}`),
    create: (data) => apiClient.post('/notifications', data),
    markRead: (id) => apiClient.put(`/notifications/${id}/read`)
};

export default apiClient;
