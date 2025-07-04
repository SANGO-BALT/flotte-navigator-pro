// Service API pour communiquer avec le backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types pour les réponses API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
  token?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Classe pour gérer les requêtes API
class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Méthode pour définir le token d'authentification
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Méthode pour supprimer le token
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Headers par défaut
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Méthode générique pour les requêtes
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: this.getHeaders(),
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur réseau');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Méthodes d'authentification
  async login(email: string, password: string) {
    const response = await this.request<{ user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async register(userData: any) {
    const response = await this.request<{ user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async getProfile() {
    return this.request<{ user: any }>('/auth/me');
  }

  async updateProfile(profileData: any) {
    return this.request<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }) {
    return this.request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Méthodes pour les véhicules
  async getVehicles(params?: { page?: number; limit?: number; search?: string; status?: string; type?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/vehicles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<PaginatedResponse<any>>(endpoint);
  }

  async getVehicle(id: string) {
    return this.request<{ vehicle: any }>(`/vehicles/${id}`);
  }

  async createVehicle(vehicleData: any) {
    return this.request<{ vehicle: any }>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(id: string, vehicleData: any) {
    return this.request<{ vehicle: any }>(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(id: string) {
    return this.request(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  }

  // Méthodes pour les utilisateurs
  async getUsers(params?: { page?: number; limit?: number; search?: string; role?: string; statut?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<PaginatedResponse<any>>(endpoint);
  }

  async createUser(userData: any) {
    return this.request<{ user: any }>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Méthodes pour le carburant
  async getFuelRecords(params?: { page?: number; limit?: number; vehiculeId?: string; fuelType?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/fuel${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<PaginatedResponse<any>>(endpoint);
  }

  async createFuelRecord(fuelData: any) {
    return this.request<{ fuelRecord: any }>('/fuel', {
      method: 'POST',
      body: JSON.stringify(fuelData),
    });
  }

  // Méthodes pour la maintenance
  async getMaintenanceRecords() {
    return this.request<{ maintenanceRecords: any[]; total: number }>('/maintenance');
  }

  // Méthodes pour les violations
  async getViolations() {
    return this.request<{ violations: any[] }>('/violations');
  }

  // Méthodes pour les données GPS
  async getGPSRecords() {
    return this.request<{ gpsRecords: any[] }>('/gps');
  }

  // Méthodes pour les documents
  async getDocuments() {
    return this.request<{ documents: any[] }>('/documents');
  }

  // Méthodes pour les rapports
  async getDashboardStats() {
    return this.request<{
      statistics: {
        totalVehicles: number;
        activeVehicles: number;
        totalUsers: number;
        totalFuelCost: number;
        totalMaintenanceCost: number;
        pendingViolations: number;
      };
      recentActivities: {
        fuelRecords: any[];
        upcomingMaintenances: any[];
      };
    }>('/reports/dashboard');
  }

  // Méthode pour upload de fichiers
  async uploadFile(file: File, endpoint: string = '/upload') {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur lors de l\'upload');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }
}

// Instance singleton du service API
export const apiService = new ApiService();

// Export des types
export type { ApiResponse, PaginatedResponse };