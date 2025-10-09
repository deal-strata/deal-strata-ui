import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services';
import type { User, SignupData, LoginResponse, SignupResponse } from '../services';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  signup: (userData: SignupData) => Promise<SignupResponse>;
  logout: () => void;
  isAuthenticated: () => boolean;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        const result = await authApi.getCurrentUser();
        if (result.success && result.data) {
          setUser(result.data);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const result = await authApi.login(email, password);
      
      if (result.success && result.data) {
        setUser(result.data);
        return { success: true, user: result.data };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData: SignupData): Promise<SignupResponse> => {
    try {
      const result = await authApi.signup({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password || ''
      });
      
      if (result.success && result.data) {
        setUser(result.data);
        return { success: true, user: result.data };
      } else {
        return { success: false, error: result.error || 'Signup failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { success: false, error: errorMessage };
    }
  };

  const logout = (): void => {
    authApi.logout();
    setUser(null);
  };

  const isAuthenticated = (): boolean => {
    return user !== null;
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export type { AuthContextType };