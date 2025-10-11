import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { authApi } from '../services'; // Commented out for mock mode
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

// Mock user for testing - always logged in
const MOCK_USER: User = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  name: 'Test User',
  token: 'mock-token-12345',
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // For mock/testing: always return logged in user
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false); // No loading for mock

  // Mock auth check - immediately set user as logged in
  useEffect(() => {
    setUser(MOCK_USER);
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<LoginResponse> => {
    // Mock login - always succeeds
    console.log('[MOCK] Login attempt:', email);
    setUser(MOCK_USER);
    return { 
      success: true, 
      user: MOCK_USER 
    };
  };

  const signup = async (userData: SignupData): Promise<SignupResponse> => {
    // Mock signup - always succeeds
    console.log('[MOCK] Signup attempt:', userData);
    const newUser: User = {
      ...MOCK_USER,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      name: `${userData.firstName} ${userData.lastName}`,
    };
    setUser(newUser);
    return { 
      success: true, 
      user: newUser 
    };
  };

  const logout = (): void => {
    // Mock logout - but keep user logged in for testing
    console.log('[MOCK] Logout called - user remains logged in for testing');
    // Uncomment the line below to actually logout:
    // setUser(null);
  };

  const isAuthenticated = (): boolean => {
    // For mock/testing: always return true
    return true;
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