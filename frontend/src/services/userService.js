import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { authService } from '@/services/authService';

export class UserService {
  // Get all users
  async getAllUsers() {
    const response = await apiClient.get(API_ENDPOINTS.USERS_ALL);
    return response;
  }

  // Get user by ID
  async getUserById(id) {
    const response = await apiClient.get(API_ENDPOINTS.USERS_BY_ID(id));
    return response;
  }

  // Update user profile
  async updateProfile(id, updateData) {
    const response = await apiClient.put(
      API_ENDPOINTS.USERS_UPDATE(id), 
      updateData
    );
    return response;
  }

  // Note: These methods are commented out because the backend endpoints don't exist yet
  
  // // Upload user avatar
  // async uploadAvatar(avatarFile) {
  //   const formData = new FormData();
  //   formData.append('avatar', avatarFile);
  //   
  //   const response = await apiClient.post(
  //     API_ENDPOINTS.USERS_UPLOAD_AVATAR, 
  //     formData,
  //     {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     }
  //   );
  //   return response;
  // }

  // // Get user's repositories
  // async getUserRepositories(userId) {
  //   const response = await apiClient.get(API_ENDPOINTS.USERS_REPOS(userId));
  //   return response;
  // }

  // // Get user's issues
  // async getUserIssues(userId) {
  //   const response = await apiClient.get(API_ENDPOINTS.USERS_ISSUES(userId));
  //   return response;
  // }

  // // Search users
  // async searchUsers(query) {
  //   const response = await apiClient.get(
  //     `${API_ENDPOINTS.USERS_SEARCH}?q=${encodeURIComponent(query)}`
  //   );
  //   return response;
  // }

  // // Get user statistics
  // async getUserStats(userId) {
  //   const response = await apiClient.get(API_ENDPOINTS.USERS_STATS(userId));
  //   return response;
  // }

  // Delete user account
  async deleteAccount(id) {
    const response = await apiClient.delete(API_ENDPOINTS.USERS_DELETE(id));
    return response;
  }

  // Login user (delegate to authService)
  async login(credentials) {
    return authService.login(credentials);
  }

  // Signup user (delegate to authService)
  async signup(userData) {
    return authService.signup(userData);
  }

  // Get token (delegate to authService)
  getToken() {
    return authService.getToken();
  }

  // Save token (delegate to authService)
  saveToken(token) {
    return authService.saveToken(token);
  }

  // Remove token (delegate to authService)
  removeToken() {
    return authService.removeToken();
  }
}

export const userService = new UserService();
