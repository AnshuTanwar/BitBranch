export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: '/users/signup',
  LOGIN: '/users/login',
  CURRENT_USER: '/users/me',
  
  // User endpoints (only existing backend endpoints)
  USERS_ALL: '/users',
  USERS_BY_ID: (id) => `/users/${id}`,
  USERS_UPDATE: (id) => `/users/${id}`,
  USERS_DELETE: (id) => `/users/${id}`,
  // Note: These endpoints don't exist in backend yet:
  // USERS_UPLOAD_AVATAR: '/users/avatar',
  // USERS_REPOS: (userId) => `/users/${userId}/repos`,
  // USERS_ISSUES: (userId) => `/users/${userId}/issues`,
  // USERS_SEARCH: '/users/search',
  // USERS_STATS: (userId) => `/users/${userId}/stats`,
  
  // Repository endpoints (only existing backend endpoints)
  REPOS_CREATE: '/repos',
  REPOS_ALL: '/repos/all',
  REPOS_MY: '/repos/my',
  REPOS_BY_ID: (id) => `/repos/${id}`,
  REPOS_UPDATE: (id) => `/repos/${id}`,
  REPOS_DELETE: (id) => `/repos/${id}`,
  REPOS_TOGGLE_VISIBILITY: (id) => `/repos/${id}/visibility`,
  REPOS_STAR: (id) => `/repos/${id}/star`,
  REPOS_UNSTAR: (id) => `/repos/${id}/star`,
  REPOS_STARRED_ME: '/repos/starred/me',
  // Note: These endpoints don't exist in backend yet:
  // REPOS_BY_NAME: (name) => `/repos/name/${name}`,
  // REPOS_CONTRIBUTORS: (id) => `/repos/${id}/contributors`,
  // REPOS_FORK: (id) => `/repos/${id}/fork`,
  // REPOS_STATS: (id) => `/repos/${id}/stats`,
  
  // Issue endpoints (FIXED to match backend)
  ISSUES_ALL: '/issues',
  ISSUES_CREATE: (repoId) => `/issues/create/${repoId}`,
  ISSUES_BY_ID: (id) => `/issues/${id}`,
  ISSUES_BY_REPO: (repoId) => `/issues/repo/${repoId}`,
  ISSUES_UPDATE: (id) => `/issues/update/${id}`,
  ISSUES_STATUS: (id) => `/issues/${id}/status`,
  ISSUES_DELETE: (id) => `/issues/delete/${id}`,
  ISSUES_ASSIGN: (id) => `/issues/${id}/assign`,
  ISSUES_CLOSE: (id) => `/issues/${id}/close`,
  ISSUES_REOPEN: (id) => `/issues/${id}/reopen`,
  
  // Comments (FIXED to match backend)
  ISSUES_COMMENTS: (issueId) => `/issues/${issueId}/comments`,
  ISSUES_COMMENT_CREATE: (issueId) => `/issues/${issueId}/comments`,
  ISSUES_COMMENT_UPDATE: (issueId, commentId) => `/issues/${issueId}/comments/${commentId}`,
  ISSUES_COMMENT_DELETE: (issueId, commentId) => `/issues/${issueId}/comments/${commentId}`,
  
  // Social features (FIXED to match backend)
  SOCIAL_FOLLOW: (id) => `/social/${id}/follow`,
  SOCIAL_UNFOLLOW: (id) => `/social/${id}/follow`,
  SOCIAL_FOLLOWERS: (id) => `/social/${id}/followers`,
  SOCIAL_FOLLOWING: (id) => `/social/${id}/following`,
  SOCIAL_STARRED: '/social/me/starred',
  SOCIAL_IS_FOLLOWING: (id) => `/social/${id}/is-following`,
  SOCIAL_ACTIVITY: (id) => `/social/${id}/activity`,
  SOCIAL_STATS: (id) => `/social/${id}/stats`,
};
