import axios from 'axios';
import type { 
  User, Lab, PC, Equipment, Software, MaintenanceLog, Inventory,
  LoginRequest, RegisterRequest, AuthResponse 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');
const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};
const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = response.data;
          setTokens(access, refreshToken);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          clearTokens();
          window.location.href = '/login';
        }
      } else {
        clearTokens();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/login/', data);
    return response.data;
  },
  
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post('/register/', data);
    return response.data;
  },
  
  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    const response = await api.post('/token/refresh/', { refresh });
    return response.data;
  },
};

// Labs API
export const labsAPI = {
  getAll: async (): Promise<Lab[]> => {
    const response = await api.get('/labs/');
    return response.data;
  },
  
  getById: async (id: number): Promise<Lab> => {
    const response = await api.get(`/labs/${id}/`);
    return response.data;
  },
  
  create: async (data: Omit<Lab, 'id' | 'created_at' | 'updated_at'>): Promise<Lab> => {
    const response = await api.post('/labs/', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Lab>): Promise<Lab> => {
    const response = await api.patch(`/labs/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/labs/${id}/`);
  },
};

// PCs API
export const pcsAPI = {
  getByLab: async (labId: number): Promise<PC[]> => {
    const response = await api.get(`/labs/${labId}/pcs/`);
    return response.data;
  },
  
  getById: async (id: number): Promise<PC> => {
    const response = await api.get(`/pcs/${id}/`);
    return response.data;
  },
  
  create: async (labId: number, data: Omit<PC, 'id' | 'lab'>): Promise<PC> => {
    const response = await api.post(`/labs/${labId}/pcs/`, data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<PC>): Promise<PC> => {
    const response = await api.patch(`/pcs/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/pcs/${id}/`);
  },
};

// Equipment API
export const equipmentAPI = {
  getAll: async (): Promise<Equipment[]> => {
    const response = await api.get('/equipments/');
    return response.data;
  },
  
  getById: async (id: number): Promise<Equipment> => {
    const response = await api.get(`/equipments/${id}/`);
    return response.data;
  },
  
  create: async (data: Omit<Equipment, 'id' | 'added_on' | 'updated_at'>): Promise<Equipment> => {
    const response = await api.post('/equipments/', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Equipment>): Promise<Equipment> => {
    const response = await api.patch(`/equipments/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/equipments/${id}/`);
  },
};

// Software API
export const softwareAPI = {
  getAll: async (): Promise<Software[]> => {
    const response = await api.get('/software/');
    return response.data;
  },
  
  getById: async (id: number): Promise<Software> => {
    const response = await api.get(`/software/${id}/`);
    return response.data;
  },
  
  create: async (data: Omit<Software, 'id'>): Promise<Software> => {
    const response = await api.post('/software/', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Software>): Promise<Software> => {
    const response = await api.patch(`/software/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/software/${id}/`);
  },
};

// Maintenance API
export const maintenanceAPI = {
  getAll: async (): Promise<MaintenanceLog[]> => {
    const response = await api.get('/maintenance/');
    return response.data;
  },
  
  getById: async (id: number): Promise<MaintenanceLog> => {
    const response = await api.get(`/maintenance/${id}/`);
    return response.data;
  },
  
  create: async (data: Omit<MaintenanceLog, 'id' | 'reported_on' | 'fixed_on'>): Promise<MaintenanceLog> => {
    const response = await api.post('/maintenance/', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<MaintenanceLog>): Promise<MaintenanceLog> => {
    const response = await api.patch(`/maintenance/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/maintenance/${id}/`);
  },
};

// Inventory API
export const inventoryAPI = {
  getAll: async (): Promise<Inventory[]> => {
    const response = await api.get('/inventory/');
    return response.data;
  },
  
  getById: async (id: number): Promise<Inventory> => {
    const response = await api.get(`/inventory/${id}/`);
    return response.data;
  },
  
  create: async (data: Omit<Inventory, 'id'>): Promise<Inventory> => {
    const response = await api.post('/inventory/', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Inventory>): Promise<Inventory> => {
    const response = await api.patch(`/inventory/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/inventory/${id}/`);
  },
};

export { setTokens, clearTokens, getToken };
export default api;
