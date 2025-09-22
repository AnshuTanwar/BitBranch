import { API_BASE_URL } from '@/config/api';

export class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    console.log('Auth token:', token ? 'Present' : 'Missing'); // Debug log
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      const error = new Error(errorData.message || errorData.error || 'Request failed');
      error.status = response.status;
      error.statusCode = response.status;
      
      // Log detailed error for debugging
      console.error('API Error:', {
        status: response.status,
        url: response.url,
        error: errorData
      });
      
      throw error;
    }

    const data = await response.json();
    return data;
  }

  async get(endpoint) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('GET request to:', url); // Debug log
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async post(endpoint, data) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('POST request to:', url, 'with data:', data); // Debug log
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async put(endpoint, data) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('PUT request to:', url, 'with data:', data); // Debug log
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async patch(endpoint, data) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('PATCH request to:', url, 'with data:', data); // Debug log
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async delete(endpoint) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('DELETE request to:', url); // Debug log
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();
