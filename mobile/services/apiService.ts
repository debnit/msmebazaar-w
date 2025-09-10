import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    
    return response.json();
  }


  async submitLoanApplication(data: LoanApplicationData): Promise<{ success: boolean; error?: string }> {
    try {
      await this.fetch('/loan-application', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  }

  async submitEnquiry(data: EnquiryData): Promise<{ success: boolean; error?: string }> {
    try {
       await this.fetch('/enquiry', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  }

  async getDashboardData(): Promise<{ success: boolean; data?: DashboardData; error?: string }> {
    try {
      const data = await this.fetch('/user/dashboard');
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  }
}

export const apiService = new ApiService();
