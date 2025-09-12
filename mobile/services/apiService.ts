
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from './authService';


const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Request Payloads
export interface LoanApplicationData {
  fullName: string;
  email: string;
  phone: string;
  pan: string;
  businessName: string;
  businessType: string;
  yearsInBusiness: number;
  annualTurnover: number;
  loanAmount: number;
  loanPurpose: string;
}

export interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface RedemptionData {
    amount: number;
    method: string;
    details: string;
}

export interface ProProfileData {
    businessName: string;
    businessNature: string;
    helpNeeded: string;
    consultationNotes: string;
}

export interface ValuationOnboardingData {
    turnover: number;
    assets: string;
    liabilities: string;
    phone: string;
    balanceSheetUrl?: string;
    gstReturnsUrl?: string;
}

export interface NavArambhOnboardingData {
  assetDetails: string;
  turnoverDetails: string;
  loanDetails: string;
  problemDetails: string;
  contactDetails: string;
}

export interface PlantAndMachineryOnboardingData {
  requestType: 'buy' | 'sell' | 'lease';
  machineryDetails: string;
  name: string;
  phone: string;
  details: string;
}

export interface AdvertisementOnboardingData {
    businessName: string;
    businessNature: string;
    businessAddress: string;
    contactDetails: string;
    photosUrl?: string;
    videosUrl?: string;
}

export interface UserProfileUpdateData {
    name: string;
    profilePictureUrl?: string;
}

export interface BusinessPlanData {
    businessName: string;
    industry: string;
    targetAudience: string;
}


// API Response Structures
export interface DashboardData {
  user: {
    name: string;
    email: string;
    referralCode: string;
    walletBalance: number;
    profilePictureUrl?: string;
  };
  enquiries: Array<{
    id: string;
    subject: string;
    date: string;
    status: string;
  }>;
  loanApplications: Array<{
    id: string;
    amount: string;
    date: string;
    status: string;
  }>;
  paymentTransactions: Array<{
    id: string;
    service: string;
    amount: string;
    date: string;
    status: string;
  }>;
  referrals: Array<{
    id: string;
    name: string;
    date: string;
  }>;
}

export interface Enquiry {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

export interface Loan {
    id: string;
    loanAmount: number;
    loanPurpose: string;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

export interface Payment {
    id: string;
    serviceName: string;
    amount: number;
    status: string;
    createdAt: string;
    razorpayPaymentId: string;
    user: {
        name: string;
        email: string;
    }
}

export interface RedemptionRequest {
    id: string;
    amount: number;
    method: string;
    details: string;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

export interface ValuationRequest {
    id: string;
    turnover: number;
    assets: string;
    liabilities: string;
    phone: string;
    balanceSheetUrl?: string | null;
    gstReturnsUrl?: string | null;
    createdAt: string;
    user: {
        name: string;
        email: string;
    }
}

export interface NavArambhRequest {
    id: string;
    assetDetails: string;
    turnoverDetails: string;
    loanDetails: string;
    problemDetails: string;
    contactDetails: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    }
}

export interface PlantAndMachineryRequest {
    id: string;
    requestType: string;
    machineryDetails: string;
    name: string;
    phone: string;
    details: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

export interface Advertisement {
    id: string;
    businessName: string;
    businessNature: string;
    businessAddress: string;
    contactDetails: string;
    photosUrl?: string | null;
    videosUrl?: string | null;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}


export interface AdminDashboardData {
    totalRevenue: number;
    totalUsers: number;
    totalLoans: number;
    totalEnquiries: number;
    recentLoans: Loan[];
    recentUsers: User[];
    monthlyRevenue: { label: string; value: number }[];
    userSignups: { label: string; value: number }[];
}

export interface AdminUser extends User {
    isAgent: boolean;
    isPro: boolean;
    _count: {
        loanApplications: number;
        enquiries: number;
    }
    createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// API Service Class
class ApiService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const headers = await this.getAuthHeaders();
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: { ...headers, ...options.headers },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }
        
        return response.json();
    } catch (error: any) {
        throw new Error(error.message || 'Network error, please check your connection and API_BASE_URL');
    }
  }

  // General User APIs
  async submitLoanApplication(data: LoanApplicationData): Promise<{ success: boolean; error?: string }> {
    try {
      await this.fetch('/loan-application', { method: 'POST', body: JSON.stringify(data) });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async submitEnquiry(data: EnquiryData): Promise<{ success: boolean; error?: string }> {
    try {
       await this.fetch('/enquiry', { method: 'POST', body: JSON.stringify(data) });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getDashboardData(): Promise<{ success: boolean; data?: DashboardData; error?: string }> {
    try {
      const data = await this.fetch('/user/dashboard');
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getCreditScore(pan: string): Promise<{ success: boolean; score?: number; error?: string }> {
    try {
        const data = await this.fetch('/credit-score', { method: 'POST', body: JSON.stringify({ pan }) });
        return { success: true, score: data.score };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }
  
  async submitRedemptionRequest(data: RedemptionData): Promise<{ success: boolean; error?: string }> {
      try {
          await this.fetch('/user/redeem', { method: 'POST', body: JSON.stringify(data) });
          return { success: true };
      } catch (error: any) {
          return { success: false, error: error.message };
      }
  }

  async submitProProfile(data: ProProfileData): Promise<{ success: boolean; error?: string }> {
    try {
        await this.fetch('/user/pro-profile', { method: 'POST', body: JSON.stringify(data) });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }
  
  async submitValuationRequest(data: ValuationOnboardingData): Promise<{ success: boolean; error?: string }> {
    try {
        await this.fetch('/user/valuation-request', { method: 'POST', body: JSON.stringify(data) });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }
  
  async submitNavArambhRequest(data: NavArambhOnboardingData): Promise<{ success: boolean; error?: string }> {
    try {
        await this.fetch('/user/navarambh-request', { method: 'POST', body: JSON.stringify(data) });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }
  
  async submitPlantAndMachineryRequest(data: PlantAndMachineryOnboardingData): Promise<{ success: boolean; error?: string }> {
    try {
        await this.fetch('/user/plant-machinery-request', { method: 'POST', body: JSON.stringify(data) });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }
  
  async submitAdvertisement(data: AdvertisementOnboardingData): Promise<{ success: boolean; error?: string }> {
    try {
        await this.fetch('/user/advertisement', { method: 'POST', body: JSON.stringify(data) });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }

  async updateUserProfile(data: UserProfileUpdateData): Promise<{ success: boolean; error?: string }> {
    try {
        await this.fetch('/user/profile', { method: 'PATCH', body: JSON.stringify(data) });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }

  async generateBusinessPlan(data: BusinessPlanData): Promise<{ success: boolean; plan?: string; error?: string }> {
    try {
        const response = await this.fetch('/ai/business-plan', { method: 'POST', body: JSON.stringify(data) });
        return { success: true, plan: response.plan };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }


  // Notification APIs
  async getNotifications(): Promise<{ success: boolean; data?: Notification[]; error?: string }> {
    try {
      const data = await this.fetch('/notifications');
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async markNotificationsAsRead(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.fetch('/notifications', { method: 'PATCH' });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Admin APIs
  async getAdminDashboardData(): Promise<{ success: boolean; data?: AdminDashboardData; error?: string }> {
      try {
          const data = await this.fetch('/admin/dashboard-data');
          return { success: true, data };
      } catch (error: any) {
          return { success: false, error: error.message };
      }
  }

  async getEnquiries(query: string = '', dateFilter: 'all' | 'today' | '7d' | '30d' = 'all'): Promise<{ success: boolean; data?: Enquiry[]; error?: string }> {
    try {
        const params = new URLSearchParams({ query });
        if (dateFilter !== 'all') {
            const today = new Date();
            let fromDate: Date;
            if (dateFilter === 'today') {
                fromDate = new Date(today.setHours(0,0,0,0));
            } else if (dateFilter === '7d') {
                fromDate = new Date(today.setDate(today.getDate() - 7));
            } else { // 30d
                fromDate = new Date(today.setDate(today.getDate() - 30));
            }
            params.set('from', fromDate.toISOString());
            params.set('to', new Date().toISOString());
        }

        const data = await this.fetch(`/admin/enquiries?${params.toString()}`);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }
  
  async updateEnquiryStatus(id: string, status: string): Promise<{ success: boolean; error?: string }> {
      try {
          await this.fetch(`/admin/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
          return { success: true };
      } catch (error: any) {
          return { success: false, error: error.message };
      }
  }

  async getLoans(query: string = ''): Promise<{ success: boolean; data?: Loan[]; error?: string }> {
      try {
          const data = await this.fetch(`/admin/loans?query=${query}`);
          return { success: true, data };
      } catch (error: any) {
          return { success: false, error: error.message };
      }
  }

  async updateLoanStatus(id: string, status: string): Promise<{ success: boolean; error?: string }> {
      try {
          await this.fetch(`/admin/loans/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
          return { success: true };
      } catch (error: any) {
          return { success: false, error: error.message };
      }
  }

  async getPayments(query: string = ''): Promise<{ success: boolean; data?: Payment[]; error?: string }> {
      try {
          const data = await this.fetch(`/admin/payments?query=${query}`);
          return { success: true, data };
      } catch (error: any) {
          return { success: false, error: error.message };
      }
  }
  
  async getRedemptionRequests(query: string = ''): Promise<{ success: boolean; data?: RedemptionRequest[]; error?: string }> {
    try {
        const data = await this.fetch(`/admin/redemptions?query=${query}`);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }

  async updateRedemptionStatus(id: string, status: string): Promise<{ success: boolean; error?: string }> {
      try {
          await this.fetch(`/admin/redemptions/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
          return { success: true };
      } catch (error: any) {
          return { success: false, error: error.message };
      }
  }
  
  async getValuationRequests(query: string = ''): Promise<{ success: boolean; data?: ValuationRequest[]; error?: string }> {
    try {
        const data = await this.fetch(`/admin/valuations?query=${query}`);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }

  async getNavArambhRequests(query: string = ''): Promise<{ success: boolean; data?: NavArambhRequest[]; error?: string }> {
    try {
        const data = await this.fetch(`/admin/navarambh?query=${query}`);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }
  
  async getPlantAndMachineryRequests(query: string = ''): Promise<{ success: boolean; data?: PlantAndMachineryRequest[]; error?: string }> {
    try {
        const data = await this.fetch(`/admin/plant-machinery?query=${query}`);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }
  
  async getAdvertisements(query: string = ''): Promise<{ success: boolean; data?: Advertisement[]; error?: string }> {
    try {
        const data = await this.fetch(`/admin/advertisements?query=${query}`);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }

  async getUsers(query: string = '', role: 'all' | 'admin' | 'agent' | 'pro' | 'user' = 'all'): Promise<{ success: boolean; data?: AdminUser[]; error?: string }> {
      try {
          const data = await this.fetch(`/admin/users?query=${query}&role=${role}`);
          return { success: true, data };
      } catch (error: any) {
          return { success: false, error: error.message };
      }
  }

  async updateUserRole(id: string, isAdmin: boolean): Promise<{ success: boolean; error?: string }> {
      try {
          await this.fetch(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ isAdmin }) });
          return { success: true };
      } catch (error: any) {
          return { success: false, error: error.message };
      }
  }
  
  async updateUserAgentStatus(id: string, isAgent: boolean): Promise<{ success: boolean; error?: string }> {
      try {
          await this.fetch(`/admin/users/${id}/agent`, { method: 'PATCH', body: JSON.stringify({ isAgent }) });
          return { success: true };
      } catch (error: any) {
          return { success: false, error: error.message };
      }
  }
}

export const apiService = new ApiService();
