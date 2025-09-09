import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5000/api'; // Update this to your backend URL

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
}

class ApiService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async submitLoanApplication(data: LoanApplicationData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/loan-application`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to submit loan application' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async submitEnquiry(data: EnquiryData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/enquiry`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to submit enquiry' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async getDashboardData(): Promise<{ success: boolean; data?: DashboardData; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/dashboard`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to fetch dashboard data' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
}

export const apiService = new ApiService();
