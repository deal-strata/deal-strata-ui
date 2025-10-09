// Authentication API methods
// This file contains all authentication-related API calls

// Basic types for authentication
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  token?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

// Auth context specific types
export interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface SignupResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Authentication API class
export class AuthApi {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Generic HTTP request method for auth endpoints
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // TODO: Implement actual fetch logic
      // const url = this.baseURL + endpoint;
      // const config = {
      //   ...options,
      //   headers: {
      //     ...this.defaultHeaders,
      //     ...this.getAuthHeaders(),
      //     ...options.headers,
      //   },
      // };
      // const response = await fetch(url, config);
      // const data = await response.json();
      // return { success: response.ok, data };

      // Placeholder implementation
      await this.delay(1000);
      return { success: true, data: {} as T };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Login user
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    // TODO: Replace with actual API call
    // return this.request<User>('/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password }),
    // });

    await this.delay(1000);
    
    // Mock implementation for now
    const mockUser: User = {
      id: 1,
      email,
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      token: 'mock-jwt-token',
    };

    return { success: true, data: mockUser };
  }

  // Register new user
  async signup(userData: SignupRequest): Promise<ApiResponse<User>> {
    // TODO: Replace with actual API call
    // return this.request<User>('/auth/signup', {
    //   method: 'POST',
    //   body: JSON.stringify(userData),
    // });

    await this.delay(1500);

    const mockUser: User = {
      id: Date.now(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      name: `${userData.firstName} ${userData.lastName}`,
      token: 'mock-jwt-token',
    };

    return { success: true, data: mockUser };
  }

  // Logout user
  async logout(): Promise<ApiResponse<void>> {
    // TODO: Replace with actual API call
    // return this.request<void>('/auth/logout', {
    //   method: 'POST',
    // });

    await this.delay(500);
    return { success: true };
  }

  // Get current authenticated user
  async getCurrentUser(): Promise<ApiResponse<User>> {
    // TODO: Replace with actual API call
    // return this.request<User>('/auth/me');

    await this.delay(300);
    
    // Check localStorage for mock user
    const stored = localStorage.getItem('user');
    if (stored) {
      return { success: true, data: JSON.parse(stored) };
    }
    
    return { success: false, error: 'Not authenticated' };
  }

  // Refresh authentication token
  async refreshToken(): Promise<ApiResponse<User>> {
    // TODO: Replace with actual API call
    // return this.request<User>('/auth/refresh', {
    //   method: 'POST',
    // });

    await this.delay(500);
    
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      // Update token
      user.token = `refreshed-token-${Date.now()}`;
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, data: user };
    }
    
    return { success: false, error: 'No valid session' };
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const stored = localStorage.getItem('user');
    return !!stored;
  }

  // Helper methods
  private getAuthHeaders(): Record<string, string> {
    // TODO: Implement proper token retrieval
    // const token = localStorage.getItem('authToken');
    // return token ? { Authorization: `Bearer ${token}` } : {};
    return {};
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Configuration methods
  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  setAuthToken(token: string): void {
    // TODO: Implement token storage
    // localStorage.setItem('authToken', token);
    console.log('Auth token set:', token);
  }

  clearAuthToken(): void {
    // TODO: Implement token removal
    // localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    console.log('Auth token cleared');
  }
}

// Export singleton instance
export const authApi = new AuthApi();