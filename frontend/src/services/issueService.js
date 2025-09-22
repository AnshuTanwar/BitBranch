import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';

export class IssueService {
  // Create issue
  async createIssue(repoId, issueData) {
    const response = await apiClient.post(
      API_ENDPOINTS.ISSUES_CREATE(repoId), 
      issueData
    );
    return response;
  }

  // Get all issues
  async getAllIssues() {
    const response = await apiClient.get(API_ENDPOINTS.ISSUES_ALL);
    return response;
  }

  // Get issue by ID
  async getIssueById(id) {
    const response = await apiClient.get(API_ENDPOINTS.ISSUES_BY_ID(id));
    return response;
  }

  // Get repository issues
  async getRepositoryIssues(repoId) {
    const response = await apiClient.get(API_ENDPOINTS.ISSUES_BY_REPO(repoId));
    return response;
  }

  // Update issue
  async updateIssue(id, updateData) {
    const response = await apiClient.put(
      API_ENDPOINTS.ISSUES_UPDATE(id), 
      updateData
    );
    return response;
  }

  // Update issue status
  async updateIssueStatus(id, statusData) {
    const response = await apiClient.put(
      API_ENDPOINTS.ISSUES_STATUS(id), 
      statusData
    );
    return response;
  }

  // Delete issue
  async deleteIssue(id) {
    const response = await apiClient.delete(API_ENDPOINTS.ISSUES_DELETE(id));
    return response;
  }

  // Add comment to issue
  async addComment(issueId, commentData) {
    const response = await apiClient.post(
      API_ENDPOINTS.ISSUES_COMMENTS(issueId), 
      commentData
    );
    return response;
  }

  // Get issue comments
  async getIssueComments(issueId) {
    const response = await apiClient.get(API_ENDPOINTS.ISSUES_COMMENTS(issueId));
    return response;
  }

  // Update comment
  async updateComment(issueId, commentId, updateData) {
    const response = await apiClient.put(
      API_ENDPOINTS.ISSUES_COMMENT_UPDATE(issueId, commentId), 
      updateData
    );
    return response;
  }

  // Delete comment
  async deleteComment(issueId, commentId) {
    const response = await apiClient.delete(
      API_ENDPOINTS.ISSUES_COMMENT_DELETE(issueId, commentId)
    );
    return response;
  }

  // Assign issue
  async assignIssue(id, assigneeData) {
    const response = await apiClient.put(
      API_ENDPOINTS.ISSUES_ASSIGN(id), 
      assigneeData
    );
    return response;
  }

  // Close issue
  async closeIssue(id) {
    const response = await apiClient.patch(
      API_ENDPOINTS.ISSUES_CLOSE(id)
    );
    return response;
  }

  // Reopen issue
  async reopenIssue(id) {
    const response = await apiClient.patch(
      API_ENDPOINTS.ISSUES_REOPEN(id)
    );
    return response;
  }
}

export const issueService = new IssueService();
