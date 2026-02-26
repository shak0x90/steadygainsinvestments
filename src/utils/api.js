const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
    return localStorage.getItem('sg_token');
}

async function request(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Request failed');
    }

    return data;
}

const api = {
    // Auth
    signin: (email, password) => request('/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) }),
    signup: (name, email, password) => request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
    getMe: () => request('/auth/me'),

    // Plans
    getPlans: () => request('/plans'),
    getPlan: (id) => request(`/plans/${id}`),
    createPlan: (data) => request('/plans', { method: 'POST', body: JSON.stringify(data) }),
    updatePlan: (id, data) => request(`/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletePlan: (id) => request(`/plans/${id}`, { method: 'DELETE' }),

    // Transactions
    getTransactions: (type) => request(`/transactions${type ? `?type=${type}` : ''}`),
    createTransaction: (data) => request('/transactions', { method: 'POST', body: JSON.stringify(data) }),
    updateTxStatus: (id, status) => request(`/transactions/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    getMyInvoices: () => request('/transactions/invoices'),

    // Portfolio
    getHoldings: () => request('/portfolio'),
    getPortfolioSummary: () => request('/portfolio/summary'),
    subscribePlan: (data) => request('/portfolio/subscribe', { method: 'POST', body: JSON.stringify(data) }),

    // Admin - Users
    getUsers: () => request('/users'),
    getUser: (id) => request(`/users/${id}`),
    updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getAdminStats: () => request('/users/stats/overview'),
    payReturn: (userId, data) => request(`/users/${userId}/pay-return`, { method: 'POST', body: JSON.stringify(data) }),
    getUserInvoices: (userId) => request(`/users/${userId}/invoices`),

    // Content
    getContent: () => request('/content'),
    getContentBySection: (section) => request(`/content/${section}`),
    updateContent: (items) => request('/content', { method: 'PUT', body: JSON.stringify({ items }) }),
};

export default api;
