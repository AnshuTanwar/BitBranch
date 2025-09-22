import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';

export class RepoService {
  // Create repository
  async createRepository(repoData) {
    const response = await apiClient.post(
      API_ENDPOINTS.REPOS_CREATE, 
      repoData
    );
    return response;
  }

  // Get all repositories
  async getAllRepositories() {
    const response = await apiClient.get(API_ENDPOINTS.REPOS_ALL);
    return response;
  }

  // Get repository by ID
  async getRepositoryById(id) {
    const response = await apiClient.get(API_ENDPOINTS.REPOS_BY_ID(id));
    return response;
  }

  // Get current user's repositories
  async getCurrentUserRepositories() {
    const response = await apiClient.get(API_ENDPOINTS.REPOS_MY);
    // Handle the structured response format from backend
    return response.repos || response;
  }

  // Toggle repository visibility
  async toggleRepositoryVisibility(id) {
    const response = await apiClient.patch(API_ENDPOINTS.REPOS_TOGGLE_VISIBILITY(id));
    return response;
  }

  // Update repository
  async updateRepository(id, updateData) {
    const response = await apiClient.put(
      API_ENDPOINTS.REPOS_UPDATE(id), 
      updateData
    );
    return response;
  }

  // Delete repository
  async deleteRepository(id) {
    const response = await apiClient.delete(API_ENDPOINTS.REPOS_DELETE(id));
    return response;
  }

  // Star repository
  async starRepository(id) {
    const response = await apiClient.post(API_ENDPOINTS.REPOS_STAR(id));
    return response;
  }

  // Unstar repository
  async unstarRepository(id) {
    const response = await apiClient.delete(API_ENDPOINTS.REPOS_UNSTAR(id));
    return response;
  }

  // Note: These methods are commented out because the backend endpoints don't exist yet
  
  // // Get repository contributors
  // async getRepositoryContributors(id) {
  //   const response = await apiClient.get(API_ENDPOINTS.REPOS_CONTRIBUTORS(id));
  //   return response;
  // }

  // // Fork repository
  // async forkRepository(id) {
  //   const response = await apiClient.post(API_ENDPOINTS.REPOS_FORK(id));
  //   return response;
  // }

  // // Get repository statistics
  // async getRepositoryStats(id) {
  //   const response = await apiClient.get(API_ENDPOINTS.REPOS_STATS(id));
  //   return response;
  // }
}

export const repoService = new RepoService();
