// Authentication utility functions

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getUserId = () => {
  return localStorage.getItem('userId');
};

export const setUserId = (userId) => {
  localStorage.setItem('userId', userId);
};

export const removeUserId = () => {
  localStorage.removeItem('userId');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const parseJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const payload = parseJWT(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};

export const clearAuthData = () => {
  removeToken();
  removeUserId();
};
