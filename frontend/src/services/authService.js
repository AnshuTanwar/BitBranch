import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';

export class AuthService {
  // Login user
  async login(credentials) {
    const response = await apiClient.post(
      API_ENDPOINTS.LOGIN, 
      credentials
    );
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
    }
    
    return response;
  }

  // Register user
  async signup(userData) {
    const response = await apiClient.post(
      API_ENDPOINTS.SIGNUP, 
      userData
    );
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
    }
    
    return response;
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  // Get current user
  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiClient.get(API_ENDPOINTS.CURRENT_USER);
    return response;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  }

  // Get stored user ID
  getUserId() {
    return localStorage.getItem('userId');
  }

  // Save token (used by userService)
  saveToken(token) {
    localStorage.setItem('token', token);
  }

  // Remove token (used by userService)
  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
}

export const authService = new AuthService();
