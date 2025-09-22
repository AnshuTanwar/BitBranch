import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';

export class SocialService {
  // Follow user
  async followUser(userId) {
    const response = await apiClient.post(API_ENDPOINTS.SOCIAL_FOLLOW(userId));
    return response;
  }

  // Unfollow user
  async unfollowUser(userId) {
    const response = await apiClient.delete(API_ENDPOINTS.SOCIAL_UNFOLLOW(userId));
    return response;
  }

  // Get followers
  async getFollowers(userId) {
    const response = await apiClient.get(API_ENDPOINTS.SOCIAL_FOLLOWERS(userId));
    return response;
  }

  // Get following
  async getFollowing(userId) {
    const response = await apiClient.get(API_ENDPOINTS.SOCIAL_FOLLOWING(userId));
    return response;
  }

  // Get starred repositories
  async getStarredRepositories(userId) {
    const response = await apiClient.get(API_ENDPOINTS.SOCIAL_STARRED(userId));
    return response;
  }

  // Check if following user
  async isFollowing(userId) {
    const response = await apiClient.get(API_ENDPOINTS.SOCIAL_IS_FOLLOWING(userId));
    return response;
  }

  // Get user's activity feed
  async getActivityFeed(userId) {
    const response = await apiClient.get(API_ENDPOINTS.SOCIAL_ACTIVITY(userId));
    return response;
  }

  // Get social stats
  async getSocialStats(userId) {
    const response = await apiClient.get(API_ENDPOINTS.SOCIAL_STATS(userId));
    return response;
  }
}

export const socialService = new SocialService();
