import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/userService';
import { repoService } from '@/services/repoService';
import { issueService } from '@/services/issueService';
import { socialService } from '@/services/socialService';

// Generic API hook with retry logic
export function useApi(
  apiCall,
  dependencies = [],
  options = {}
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { retry = 3, retryDelay = (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000) } = options;

  const fetchData = useCallback(async (attemptCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      console.error(`API Error (attempt ${attemptCount + 1}):`, err);
      
      if (attemptCount < retry) {
        const delay = retryDelay(attemptCount);
        console.log(`Retrying in ${delay}ms...`);
        setTimeout(() => fetchData(attemptCount + 1), delay);
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [apiCall, retry, retryDelay]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch };
}

// Specific hooks for different resources
export const useUsers = () => useApi(() => userService.getAllUsers());
export const useUser = (id) => useApi(() => userService.getUserById(id), [id]);
export const useRepositories = () => useApi(() => repoService.getAllRepositories());
export const useUserRepositories = () => useApi(() => repoService.getCurrentUserRepositories());
export const useRepository = (id) => {
  return useApi(() => {
    // Skip API call if id is null, undefined, empty, or dummy
    if (!id || id === 'dummy' || id === '') {
      return Promise.resolve(null);
    }
    return repoService.getRepositoryById(id);
  }, [id]);
};
export const useIssues = () => useApi(() => issueService.getAllIssues());
export const useIssue = (id) => useApi(() => issueService.getIssueById(id), [id]);
export const useIssueComments = (issueId) => useApi(() => issueService.getIssueComments(issueId), [issueId]);
export const useRepositoryIssues = (repoId) => {
  // Don't make API call if repoId is missing or invalid
  if (!repoId || repoId === 'undefined' || repoId === 'null') {
    return { data: [], loading: false, error: 'Invalid repository ID', refetch: () => {} };
  }
  return useApi(() => issueService.getRepositoryIssues(repoId), [repoId]);
};

// Social features
export const useFollowers = (userId) => useApi(() => socialService.getFollowers(userId), [userId]);
export const useFollowing = (userId) => useApi(() => socialService.getFollowing(userId), [userId]);
export const useStarredRepositories = (userId) => useApi(() => socialService.getStarredRepositories(userId), [userId]);
