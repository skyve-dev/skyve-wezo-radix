const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // User endpoints
  async login(email: string, password: string) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getUsers(params?: { role?: string; isActive?: boolean }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/users${queryString}`);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async createUser(data: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Villa endpoints
  async getVillas(params?: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    bedrooms?: number;
    isActive?: boolean;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/villas${queryString}`);
  }

  async getVilla(id: string) {
    return this.request(`/villas/${id}`);
  }

  async createVilla(data: any) {
    return this.request('/villas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVilla(id: string, data: any) {
    return this.request(`/villas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVilla(id: string) {
    return this.request(`/villas/${id}`, {
      method: 'DELETE',
    });
  }

  // Booking endpoints
  async getBookings(params?: {
    villaId?: string;
    tenantId?: string;
    status?: string;
    paymentStatus?: string;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/bookings${queryString}`);
  }

  async getBooking(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async createBooking(data: any) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBooking(id: string, data: any) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBooking(id: string) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // Notification endpoints
  async getNotifications(params?: {
    userId?: string;
    type?: string;
    isRead?: boolean;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/notifications${queryString}`);
  }

  async createNotification(data: any) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async deleteNotification(id: string) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Promotion endpoints
  async getPromotions(params?: { isActive?: boolean }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/promotions${queryString}`);
  }

  async getPromotion(id: string) {
    return this.request(`/promotions/${id}`);
  }

  async createPromotion(data: any) {
    return this.request('/promotions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePromotion(id: string, data: any) {
    return this.request(`/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePromotion(id: string) {
    return this.request(`/promotions/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();