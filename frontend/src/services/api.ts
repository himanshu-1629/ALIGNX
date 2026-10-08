/**
 * ALIGNX Frontend API Client
 * Interfaces with Express + Mongoose Backend (PORT 5001)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

export class ApiService {
  private static token: string | null = localStorage.getItem('alignx_auth_token');
  private static studentId: string | null = localStorage.getItem('alignx_student_id');

  public static setAuth(token: string, studentId?: string) {
    this.token = token;
    localStorage.setItem('alignx_auth_token', token);
    if (studentId) {
      this.studentId = studentId;
      localStorage.setItem('alignx_student_id', studentId);
    }
  }

  public static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('alignx_auth_token');
    }
    return this.token;
  }

  public static getStudentId(): string | null {
    if (!this.studentId) {
      this.studentId = localStorage.getItem('alignx_student_id');
    }
    return this.studentId;
  }

  public static clearAuth() {
    this.token = null;
    this.studentId = null;
    localStorage.removeItem('alignx_auth_token');
    localStorage.removeItem('alignx_student_id');
  }

  public static clearToken() {
    this.clearAuth();
  }

  public static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
      console.warn(`[ALIGNX API] Request to ${endpoint} failed:`, err);
      throw err;
    }
  }

  // Auto initialize or verify session
  public static async ensureSession(defaultProfile?: { name?: string; email?: string; educationLevel?: string; location?: string }) {
    if (this.getToken()) {
      try {
        const me = await this.getMe();
        if (me?.data?.id) {
          this.setAuth(this.getToken()!, me.data.id);
          return me.data;
        }
      } catch {
        // Token expired or invalid, proceed to auto-register new session
      }
    }

    // Auto create guest / student session
    const guestId = Math.random().toString(36).substring(2, 9);
    const payload = {
      name: defaultProfile?.name || 'Alex Mercer',
      email: defaultProfile?.email || `student_${guestId}@alignx.internal`,
      password: 'AlignxStudentPass123!',
      educationLevel: defaultProfile?.educationLevel || 'Grade 11-12',
      location: defaultProfile?.location || 'India'
    };

    try {
      const res = await this.register(payload);
      return res.data?.student;
    } catch (err) {
      console.warn('[ALIGNX API] Auto-session initialization fallback:', err);
      return null;
    }
  }

  // 1. Health
  public static async getHealth() {
    return this.request<{ success: boolean; data: any }>('/health');
  }

  // 2. Auth
  public static async register(payload: { name: string; email: string; password: string; educationLevel?: string; location?: string }) {
    const res = await this.request<{ success: boolean; data: { studentId?: string; accessToken?: string; token?: string; student: any } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const token = res.data?.accessToken || res.data?.token;
    const studentId = res.data?.studentId || res.data?.student?.id || res.data?.student?._id;
    if (token) {
      this.setAuth(token, studentId);
    }
    return res;
  }

  public static async login(payload: { email: string; password: string }) {
    const res = await this.request<{ success: boolean; data: { accessToken?: string; token?: string; student: any } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const token = res.data?.accessToken || res.data?.token;
    const studentId = res.data?.student?.id || res.data?.student?._id;
    if (token) {
      this.setAuth(token, studentId);
    }
    return res;
  }

  public static async getMe() {
    return this.request<{ success: boolean; data: any }>('/auth/me');
  }

  // 3. Careers Catalog
  public static async getCareers(params?: { category?: string; search?: string; location?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const endpoint = query ? `/careers?${query}` : '/careers';
    return this.request<{ success: boolean; data: { total: number; careers: any[] } }>(endpoint);
  }

  public static async getCareerBySlug(slugOrId: string) {
    return this.request<{ success: boolean; data: any }>(`/careers/${slugOrId}`);
  }

  // 4. Student Profile & Onboarding
  public static async updateStudentProfile(profile: {
    name?: string;
    educationLevel?: string;
    location?: string;
    preferredLocations?: string[];
    budgetAnnualLakhs?: number;
    goals?: string[];
    interests?: string[];
    skills?: Array<{ name: string; proficiency: number }>;
  }) {
    return this.request<{ success: boolean; data: any }>('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    });
  }

  // 5. Assessments
  public static async startAssessment(assessmentType: 'career_discovery' | 'aptitude') {
    return this.request<{ success: boolean; data: { assessmentId: string; status: string } }>(`/assessments/${assessmentType === 'career_discovery' ? 'career-discovery' : 'aptitude'}/start`, {
      method: 'POST',
      body: JSON.stringify({ assessmentType })
    });
  }

  public static async submitAnswer(assessmentId: string, payload: { questionId: number | string; value: number | string; dimensionTag?: string }) {
    return this.request<{ success: boolean; data: any }>(`/assessments/${assessmentId}/response`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public static async completeAssessment(assessmentId: string, assessmentType: 'career_discovery' | 'aptitude', payload: {
    responses?: any[];
    riasecScores?: Record<string, number>;
    aptitudeScores?: Record<string, number>;
  }) {
    const endpoint = assessmentType === 'career_discovery'
      ? `/assessments/career-discovery/${assessmentId}/complete`
      : `/assessments/aptitude/${assessmentId}/complete`;
    return this.request<{ success: boolean; data: any }>(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // 6. Career DNA
  public static async getCareerDna() {
    return this.request<{ success: boolean; data: any }>('/career-dna/me');
  }

  // 7. Parent Module
  public static async getParentStatus() {
    return this.request<{
      success: boolean;
      data: {
        familyId: string;
        totalParents: number;
        parents: Array<{
          parentId: string;
          name: string;
          relationship: 'Father' | 'Mother' | 'Guardian' | 'Other';
          status: 'pending' | 'filling' | 'completed';
          email?: string;
          phone?: string;
          submittedAt?: string;
          financialProfile?: {
            educationBudget: number;
            riskAppetite: 'low' | 'medium' | 'high';
            locationPreference?: string;
            stabilityPreference?: 'low' | 'medium' | 'high';
          };
          expectations?: {
            preferredDomains?: string[];
            educationExpectations?: string[];
            priorityFactors?: string[];
            additionalNotes?: string;
          };
          budgetProvided: boolean;
          invitationToken?: string;
          invitationUrl?: string;
        }>;
        combinedFinancialContext?: any;
        alignmentAnalysis?: any;
      };
    }>('/parents/status');
  }

  public static async inviteParent(payload: {
    parentName?: string;
    parentEmail?: string;
    relation?: string;
    name?: string;
    relationship?: string;
    email?: string;
    phone?: string;
  }) {
    return this.request<{
      success: boolean;
      data: {
        parentId: string;
        parentName: string;
        relationship: string;
        status: string;
        invitationToken: string;
        invitationUrl: string;
        expiresAt: string;
      };
    }>('/parents/invite', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public static async getInvitationDetails(inviteToken: string) {
    return this.request<{
      success: boolean;
      data: {
        valid: boolean;
        studentName: string;
        studentEducation?: string;
        studentLocation?: string;
        parentId: string;
        parentName: string;
        relationship: string;
        status: string;
        expiresAt: string;
      };
    }>(`/parents/invite/${inviteToken}`);
  }

  public static async submitParentFeedback(inviteToken: string, payload: {
    educationBudget: number;
    riskAppetite?: string;
    incomeRange?: string;
    locationPreference?: string;
    stabilityPreference?: string;
    preferredDomains?: string[];
    educationExpectations?: string[];
    priorityFactors?: string[];
    additionalNotes?: string;
  }) {
    return this.request<{ success: boolean; data: any }>(`/parents/invite/${inviteToken}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public static async submitParentDirect(parentId: string, payload: {
    educationBudget: number;
    riskAppetite?: string;
    incomeRange?: string;
    locationPreference?: string;
    stabilityPreference?: string;
    preferredDomains?: string[];
    educationExpectations?: string[];
    priorityFactors?: string[];
    additionalNotes?: string;
  }) {
    return this.request<{ success: boolean; data: any }>(`/parents/${parentId}/direct-submit`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public static async resendParentInvitation(parentId: string) {
    return this.request<{
      success: boolean;
      data: {
        parentId: string;
        invitationToken: string;
        invitationUrl: string;
      };
    }>(`/parents/${parentId}/resend`, {
      method: 'POST'
    });
  }

  public static async removeParent(parentId: string) {
    return this.request<{
      success: boolean;
      message: string;
      data: any;
    }>(`/parents/${parentId}`, {
      method: 'DELETE'
    });
  }

  // 8. Recommendations Engine
  public static async generateRecommendations(options?: {
    location?: string;
    weights?: { interest: number; aptitude: number; financial: number; market: number; parent: number };
  }) {
    const sId = this.getStudentId();
    const endpoint = sId ? `/recommendations/${sId}/generate` : '/recommendations/generate';
    return this.request<{ success: boolean; data: { total: number; recommendations: any[] } }>(endpoint, {
      method: 'POST',
      body: JSON.stringify(options || {})
    });
  }

  public static async getRecommendations() {
    return this.request<{ success: boolean; data: { total: number; recommendations: any[] } }>('/recommendations/me');
  }

  // 9. Simulator
  public static async runSimulator(scenario: {
    educationBudget?: number;
    location?: string;
    riskAppetite?: string;
    timeToEmployment?: number;
    additionalSkills?: string[];
    scenarioName?: string;
  }) {
    const sId = this.getStudentId();
    const endpoint = sId ? `/simulator/${sId}` : '/simulator/run';
    return this.request<{
      success: boolean;
      data: {
        scenarioId?: string;
        scenario?: any;
        recommendations: any[];
        changes?: any[];
        keyShifts?: string[];
        originalRankings?: any[];
        simulatedRankings?: any[];
        rankChanges?: any[];
      };
    }>(endpoint, {
      method: 'POST',
      body: JSON.stringify(scenario)
    });
  }

  // 10. Career Twin
  public static async getCareerTwin(slugOrId: string) {
    return this.request<{ success: boolean; data: any }>(`/career-twin/${slugOrId}`);
  }

  // 11. Phased Roadmap
  public static async generateRoadmap(careerSlug: string) {
    return this.request<{ success: boolean; data: any }>(`/roadmaps/generate/${careerSlug}`, {
      method: 'POST'
    });
  }

  // 12. Dashboard Me
  public static async getDashboard() {
    return this.request<{ success: boolean; data: any }>('/dashboard/me');
  }

  // 13. Live Talent Atlas Telemetry & Market Intelligence
  public static async getTalentAtlasData(): Promise<ApiResponse<TalentAtlasPayload>> {
    return this.request<ApiResponse<TalentAtlasPayload>>('/market/atlas');
  }

  // 14. Live Talent & Job Search (Powered by Adzuna API)
  public static async searchLiveTalent(query?: string, location?: string, page = 1, limit = 6): Promise<ApiResponse<LiveJobSearchData>> {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (location && location !== 'All India') params.set('location', location);
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    return this.request<ApiResponse<LiveJobSearchData>>(`/market/search?${params.toString()}`);
  }
}

export interface LiveJobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  city: string;
  salaryMinINR: number | null;
  salaryMaxINR: number | null;
  salaryDisplay: string;
  avgSalaryLakhs: number | null;
  contractType: string;
  redirectUrl: string;
  created: string;
  category: string;
  description: string;
}

export interface LiveJobSearchData {
  count: number;
  meanSalaryLakhs: number | null;
  results: LiveJobPosting[];
  source: string;
  cached: boolean;
  query: string;
  location: string;
}

export interface TalentAtlasPayload {
  pulse: {
    activeOpenings: number;
    openingsDelta: string;
    nationalVelocity: number;
    volatilityScore: number;
    lastUpdated: string;
    hotHub: string;
    dominantSector: string;
  };
  states: Array<{
    id: string;
    name: string;
    capital: string;
    zone: 'South' | 'West' | 'North' | 'Central';
    tagline: string;
    startingCtcLakhs: number;
    fiveYearCtcLakhs: number;
    hiringVelocity: number;
    arbitrageYield: string;
    activePostings?: number;
    liveDelta?: string;
    topCareers: Array<{
      title: string;
      domain: string;
      surge: string;
      avgCtc: number;
    }>;
    keyHubs: string[];
    keyEmployers: string[];
    feederInstitutes: string[];
    deficitTag: string;
    plfs?: { lfpr: number; ur: number; source: string };
    employability?: { rate: number; city: string; source: string };
    gccDensity?: { count: number; source: string };
  }>;
  popularCareers: Array<{
    id: string;
    rank: number;
    title: string;
    domain: string;
    nationalSurge: string;
    startingCtc: string;
    fiveYearCtc: string;
    popularityScore: number;
    topStates: string[];
    shortageIndex: string;
    whyPopular: string;
    activeOpenings?: number;
  }>;
  provenanceSources?: Array<{
    id: string;
    title: string;
    authority: string;
    metrics: string;
    citation: string;
    url: string;
  }>;
}

