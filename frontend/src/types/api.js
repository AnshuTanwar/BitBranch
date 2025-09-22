// API Types and Interfaces for BitBranch
// This file contains JSDoc type definitions for the converted JavaScript application

/**
 * @typedef {Object} User
 * @property {string} _id - User ID
 * @property {string} username - Username
 * @property {string} email - User email
 * @property {string[]} [repositories] - User's repositories
 * @property {string} [avatar] - User avatar URL
 * @property {string} [createdAt] - Creation timestamp
 * @property {string} [updatedAt] - Update timestamp
 * @property {string[]} followedUsers - Users being followed
 * @property {string[]} starRepos - Starred repositories
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token - JWT token
 * @property {string} userId - User ID
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} email - User email
 * @property {string} password - User password
 */

/**
 * @typedef {Object} SignupRequest
 * @property {string} username - Username
 * @property {string} email - User email
 * @property {string} password - User password
 */

/**
 * @typedef {Object} Repository
 * @property {string} _id - Repository ID
 * @property {string} id - Repository ID (alias)
 * @property {string} name - Repository name
 * @property {string} [description] - Repository description
 * @property {boolean} visibility - Repository visibility (true = public)
 * @property {string} owner - Owner ID
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Update timestamp
 * @property {number} [stars] - Star count
 * @property {Issue[]} [issues] - Repository issues
 */

/**
 * @typedef {Object} CreateRepositoryRequest
 * @property {string} name - Repository name
 * @property {string} [description] - Repository description
 * @property {boolean} visibility - Repository visibility
 * @property {string[]} [content] - Initial content
 */

/**
 * @typedef {Object} UpdateRepositoryRequest
 * @property {string} [name] - Repository name
 * @property {string} [description] - Repository description
 * @property {boolean} [visibility] - Repository visibility
 */

/**
 * @typedef {Object} Issue
 * @property {string} _id - Issue ID
 * @property {string} id - Issue ID (alias)
 * @property {string} title - Issue title
 * @property {string} [description] - Issue description
 * @property {'open'|'closed'|'in-progress'} status - Issue status
 * @property {'low'|'medium'|'high'} [priority] - Issue priority
 * @property {string} repositoryId - Repository ID
 * @property {string} [repositoryName] - Repository name
 * @property {User} author - Issue author
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Update timestamp
 * @property {Comment[]} [comments] - Issue comments
 * @property {number} commentCount - Comment count
 */

/**
 * @typedef {Object} CreateIssueRequest
 * @property {string} title - Issue title
 * @property {string} [description] - Issue description
 * @property {'open'|'closed'|'in-progress'} [status] - Issue status
 * @property {'low'|'medium'|'high'} [priority] - Issue priority
 */

/**
 * @typedef {Object} UpdateIssueRequest
 * @property {string} [title] - Issue title
 * @property {string} [description] - Issue description
 * @property {'open'|'closed'|'in-progress'} [status] - Issue status
 * @property {'low'|'medium'|'high'} [priority] - Issue priority
 */

/**
 * @typedef {Object} Comment
 * @property {string} _id - Comment ID
 * @property {string} content - Comment content
 * @property {User} author - Comment author
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Update timestamp
 */

/**
 * @typedef {Object} CreateCommentRequest
 * @property {string} content - Comment content
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Success status
 * @property {string} [message] - Response message
 * @property {any} [data] - Response data
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {any[]} data - Response data
 * @property {number} total - Total count
 * @property {number} page - Current page
 * @property {number} limit - Items per page
 * @property {number} totalPages - Total pages
 */

// Export empty object to make this a module
export {};
