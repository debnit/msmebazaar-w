
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


// API Response Structures
export interface DashboardData {
  user: {
    name: string;
    email: string;
    referralCode: string;
    walletBalance: number;
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

export interface AdminDashboardData {
    totalRevenue: number;
    totalUsers: number;
    totalLoans: number;
    totalEnquiries: number;
    recentLoans: Loan[];
    recentUsers: User[];
}

export interface AdminUser extends User {
    _count: {
        loanApplications: number;
        enquiries: number;
    }
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

  // Admin APIs
  async getAdminDashboardData(): Promise<{ success: boolean; data?: AdminDashboardData; error?: string }> {
      try {
          const data = await this.fetch('/admin/dashboard-data');
          return { success: true, data };
      } catch (error: any) {
          return { success: false, error: error.message };
      }
  }

  async getEnquiries(query: string = ''): Promise<{ success: boolean; data?: Enquiry[]; error?: string }> {
    try {
        const data = await this.fetch(`/admin/enquiries?query=${query}`);
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

  async getUsers(query: string = ''): Promise<{ success: boolean; data?: AdminUser[]; error?: string }> {
      try {
          const data = await this.fetch(`/admin/users?query=${query}`);
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

}

export const apiService = new ApiService();
