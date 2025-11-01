/**
 * API Client for Nova Code Generator Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface BuildRequest {
  prompt: string;
}

export interface BuildResponse {
  projectId: string;
  status: string;
  createdAt: string;
}

export interface HealthResponse {
  status: string;
  uptime: number;
  timestamp: string;
  instances: {
    total: number;
    available: number;
    building: number;
    ready: number;
    error: number;
  };
  memory: {
    used: string;
    total: string;
  };
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Submit a build request
   */
  async createBuild(prompt: string): Promise<BuildResponse> {
    const response = await fetch(`${this.baseURL}/api/build`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get health status
   */
  async getHealth(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseURL}/health`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get SSE endpoint URL for a project
   */
  getSSEUrl(projectId: string): string {
    return `${this.baseURL}/api/events/${projectId}`;
  }

  /**
   * Get preview URL for a project
   */
  getPreviewUrl(projectId: string): string {
    return `${this.baseURL}/preview/${projectId}`;
  }
}

export const apiClient = new APIClient();
