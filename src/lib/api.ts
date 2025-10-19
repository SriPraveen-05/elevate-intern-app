// Backend API Integration for Production Deployment
// This file provides a centralized API client for all backend operations

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('app.auth.token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('app.auth.token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('app.auth.token');
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    department?: string;
    company?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User management endpoints
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Internship postings endpoints
  async getPostings() {
    return this.request('/postings');
  }

  async createPosting(postingData: any) {
    return this.request('/postings', {
      method: 'POST',
      body: JSON.stringify(postingData),
    });
  }

  async updatePosting(id: string, postingData: any) {
    return this.request(`/postings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postingData),
    });
  }

  async deletePosting(id: string) {
    return this.request(`/postings/${id}`, {
      method: 'DELETE',
    });
  }

  async approvePosting(id: string) {
    return this.request(`/postings/${id}/approve`, {
      method: 'POST',
    });
  }

  // Applications endpoints
  async getApplications() {
    return this.request('/applications');
  }

  async createApplication(applicationData: any) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async updateApplicationStatus(id: string, status: string) {
    return this.request(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Logbook endpoints
  async getLogbookEntries() {
    return this.request('/logbook');
  }

  async createLogbookEntry(entryData: any) {
    return this.request('/logbook', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  async verifyLogbookEntry(id: string) {
    return this.request(`/logbook/${id}/verify`, {
      method: 'POST',
    });
  }

  // Company verification endpoints
  async getCompanyVerifications() {
    return this.request('/company-verifications');
  }

  async submitCompanyVerification(verificationData: any) {
    return this.request('/company-verifications', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  }

  async updateCompanyVerification(id: string, status: string) {
    return this.request(`/company-verifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Events endpoints
  async getEvents() {
    return this.request('/events');
  }

  async createEvent(eventData: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Feedback endpoints
  async getIndustryFeedback() {
    return this.request('/feedback/industry');
  }

  async submitIndustryFeedback(feedbackData: any) {
    return this.request('/feedback/industry', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  // Notifications endpoints
  async getNotifications() {
    return this.request('/notifications');
  }

  async createNotification(notificationData: any) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  async markNotificationRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  // AI endpoints
  async sendChatMessage(message: string, context: string) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  async conductMockInterview(question: string, answer: string) {
    return this.request('/ai/interview', {
      method: 'POST',
      body: JSON.stringify({ question, answer }),
    });
  }

  async getCompanyInfo(companyName: string) {
    return this.request(`/ai/company/${encodeURIComponent(companyName)}`);
  }

  async getSkillRecommendations(skills: string[]) {
    return this.request('/ai/skills/recommendations', {
      method: 'POST',
      body: JSON.stringify({ skills }),
    });
  }

  async validateWithAI(itemId: string, type: 'company' | 'posting') {
    return this.request('/ai/validate', {
      method: 'POST',
      body: JSON.stringify({ itemId, type }),
    });
  }

  // Analytics endpoints
  async getAnalytics() {
    return this.request('/analytics');
  }

  async getDepartmentAnalytics(department: string) {
    return this.request(`/analytics/department/${department}`);
  }

  // File upload endpoints
  async uploadFile(file: File, type: 'resource' | 'document' | 'image') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  // Export endpoints
  async exportReport(format: 'pdf' | 'word', reportData: any) {
    return this.request('/export/report', {
      method: 'POST',
      body: JSON.stringify({ format, ...reportData }),
    });
  }

  // Sync endpoints for offline functionality
  async syncPendingChanges(changes: any[]) {
    return this.request('/sync/pending', {
      method: 'POST',
      body: JSON.stringify({ changes }),
    });
  }

  async getLastSyncTimestamp() {
    return this.request('/sync/last-sync');
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual methods for convenience
export const {
  login,
  register,
  refreshToken,
  logout,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getPostings,
  createPosting,
  updatePosting,
  deletePosting,
  approvePosting,
  getApplications,
  createApplication,
  updateApplicationStatus,
  getLogbookEntries,
  createLogbookEntry,
  verifyLogbookEntry,
  getCompanyVerifications,
  submitCompanyVerification,
  updateCompanyVerification,
  getEvents,
  createEvent,
  getIndustryFeedback,
  submitIndustryFeedback,
  getNotifications,
  createNotification,
  markNotificationRead,
  sendChatMessage,
  conductMockInterview,
  getCompanyInfo,
  getSkillRecommendations,
  validateWithAI,
  getAnalytics,
  getDepartmentAnalytics,
  uploadFile,
  exportReport,
  syncPendingChanges,
  getLastSyncTimestamp,
} = apiClient;

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error.message) {
    return error.message;
  }
  if (error.status) {
    return `Request failed with status ${error.status}`;
  }
  return 'An unexpected error occurred';
};

// Request interceptor for automatic token refresh
export const setupApiInterceptors = () => {
  const originalRequest = apiClient.request.bind(apiClient);
  
  apiClient.request = async function<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      return await originalRequest(endpoint, options) as Promise<ApiResponse<T>>;
    } catch (error: any) {
      if (error.status === 401 && this.token) {
        // Token expired, try to refresh
        try {
          const refreshResponse = await this.refreshToken();
          this.setToken(refreshResponse.data.token);
          // Retry original request
          return await originalRequest(endpoint, options) as Promise<ApiResponse<T>>;
        } catch (refreshError) {
          // Refresh failed, redirect to login
          this.clearToken();
          window.location.href = '/login';
          throw refreshError;
        }
      }
      throw error;
    }
  };
};

// Initialize interceptors
setupApiInterceptors();
