/**
 * ALIGNX Frontend API Client
 * Seamlessly interfaces with Om's Express + Mongoose Backend (PORT 5001)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';

export class ApiService {
  private static token: string | null = localStorage.getItem('alignx_auth_token');

  public static setToken(token: string) {
    this.token = token;
    localStorage.setItem('alignx_auth_token', token);
  }

  public static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('alignx_auth_token');
    }
    return this.token;
  }

  public static clearToken() {
    this.token = null;
    localStorage.removeItem('alignx_auth_token');
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`[ALIGNX API] Failed request to ${endpoint}:`, err);
      throw err;
    }
  }

  // 1. Health
  public static async getHealth() {
    return this.request<{ success: boolean; data: any }>('/health');
  }

  // 2. Auth
  public static async register(payload: { name: string; email: string; password: string; gradeLevel?: string }) {
    const res = await this.request<{ success: boolean; data: { student: any; token: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  public static async login(payload: { email: string; password: string }) {
    const res = await this.request<{ success: boolean; data: { student: any; token: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  // 3. Careers Catalog
  public static async getCareers() {
    return this.request<{ success: boolean; data: { total: number; careers: any[] } }>('/careers');
  }

  // 4. Student Skills
  public static async updateSkills(skills: Array<{ skillName: string; category?: string; proficiencyLevel?: number }>) {
    return this.request<{ success: boolean; data: any }>('/students/skills', {
      method: 'PUT',
      body: JSON.stringify({ skills })
    });
  }

  // 5. Assessments
  public static async startAssessment() {
    return this.request<{ success: boolean; data: { assessmentId: string } }>('/assessments/career-discovery/start', {
      method: 'POST'
    });
  }

  public static async completeAssessment(assessmentId: string, payload: {
    interestResponses?: any[];
    riasecScores?: Record<string, number>;
    aptitudeScores?: Record<string, number>;
    workStyleScores?: Record<string, number>;
  }) {
    return this.request<{ success: boolean; data: { careerDna: any } }>(`/assessments/${assessmentId}/complete`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // 6. Parent Module
  public static async inviteParent(payload: { parentName: string; parentEmail: string }) {
    return this.request<{ success: boolean; data: { inviteToken: string } }>('/parents/invite', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public static async submitParentFeedback(inviteToken: string, payload: {
    preferredCareerPaths?: string[];
    riskTolerance?: string;
    maxBudget?: number;
    preferredLocations?: string[];
  }) {
    return this.request<{ success: boolean; data: any }>(`/parents/invite/${inviteToken}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // 7. Recommendations
  public static async generateRecommendations() {
    return this.request<{ success: boolean; data: any }>('/recommendations/generate', {
      method: 'POST'
    });
  }

  // 8. Simulator
  public static async runSimulator(scenario: {
    budgetShift?: number;
    preferredLocation?: string;
    skillAcquisitions?: string[];
    riasecDelta?: Record<string, number>;
  }) {
    return this.request<{ success: boolean; data: any }>('/simulator/run', {
      method: 'POST',
      body: JSON.stringify(scenario)
    });
  }

  // 9. Career Twin
  public static async getCareerTwin(slug: string) {
    return this.request<{ success: boolean; data: any }>(`/career-twin/${slug}`);
  }

  // 10. Phased Roadmap
  public static async generateRoadmap(slug: string) {
    return this.request<{ success: boolean; data: any }>(`/roadmaps/generate/${slug}`, {
      method: 'POST'
    });
  }

  // 11. Dashboard Me
  public static async getDashboard() {
    return this.request<{ success: boolean; data: any }>('/dashboard/me');
  }
}
