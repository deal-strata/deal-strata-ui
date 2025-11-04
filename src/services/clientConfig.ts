/**
 * Deal Strata Client Configuration
 * Centralized configuration for the auto-generated API client
 */

import { Configuration, AgreementApi, HealthApi } from 'deal-strata-client';

/**
 * Get the authentication token from localStorage
 */
const getAuthToken = (): string => {
  return localStorage.getItem('authToken') || '';
};

/**
 * Base configuration for all API clients
 */
const apiConfiguration = new Configuration({
  // basePath: 'https://atzhome.tail18537f.ts.net',
  // basePath: 'http://localhost:8080/v1',
  basePath: 'http://localhost:4010',
  accessToken: getAuthToken,
  baseOptions: {
    // Do not set a global Content-Type header.
    // The generated client assigns the correct Content-Type per request
    // (e.g., multipart/form-data for uploads, application/json for JSON bodies).
    headers: {},
  },
});

// Export configured API instances
export const agreementApi = new AgreementApi(apiConfiguration);
export const healthApi = new HealthApi(apiConfiguration);

/**
 * Update the access token in the configuration
 * Call this after login/logout
 */
export const updateAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

/**
 * Get the current API base path
 */
export const getBasePath = (): string => {
  return apiConfiguration.basePath || 'http://localhost:8080/api';
};

export default apiConfiguration;