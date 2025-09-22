import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { socketService } from '@/services/socketService';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = userService.getToken();
      if (token) {
        try {
          // Validate JWT token format
          const tokenParts = token.split('.');
          if (tokenParts.length !== 3) {
            throw new Error('Invalid token format');
          }

          // Safely decode JWT payload
          const payload = JSON.parse(atob(tokenParts[1]));
          const userId = payload.id || payload.userId;
          
          // Check if token is expired
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            throw new Error('Token expired');
          }
          
          if (userId) {
            // Use getCurrentUser to get populated user data (followers, following, etc.)
            const userData = await authService.getCurrentUser();
            setUser(userData);
            // Connect to socket when user is authenticated
            socketService.connect(userId);
          } else {
            throw new Error('Invalid token payload');
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          userService.removeToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await userService.login(credentials);
      userService.saveToken(response.token);
      
      // Decode token to get user ID
      const payload = JSON.parse(atob(response.token.split('.')[1]));
      const userId = payload.id || payload.userId;
      
      if (userId) {
        // Use getCurrentUser to get populated user data (followers, following, etc.)
        const userData = await authService.getCurrentUser();
        setUser(userData);
        // Connect to socket after login
        socketService.connect(userId);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await userService.signup(userData);
      userService.saveToken(response.token);
      
      // Decode token to get user ID
      const payload = JSON.parse(atob(response.token.split('.')[1]));
      const userId = payload.id || payload.userId;
      
      if (userId) {
        // Use getCurrentUser to get populated user data (followers, following, etc.)
        const newUserData = await authService.getCurrentUser();
        setUser(newUserData);
        // Connect to socket after signup
        socketService.connect(userId);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    userService.removeToken();
    setUser(null);
    // Disconnect socket on logout
    socketService.disconnect();
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
