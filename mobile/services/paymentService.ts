
import RazorpayCheckout from '@react-native-razorpay/react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID;

export interface PaymentData {
  amount: number;
  serviceName: string;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  error?: string;
}

export const paymentService = {
  async getAuthHeaders() {
    const token = await AsyncStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },
  
  async createOrder(amount: number): Promise<{ orderId: string; amount: number } | null> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ amount: amount * 100 }), // API expects amount in paise
      });

      if (response.ok) {
        const data = await response.json();
        return { orderId: data.orderId, amount: data.amount };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  },

  async verifyPayment(paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    serviceName: string;
    amount: number; // This is in paise
  }): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/payment/verify`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(paymentData),
      });

      return response.ok;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  },

  async payWithWallet(paymentData: { serviceName: string; amount: number }): Promise<PaymentResponse> {
     try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/payment/wallet-pay`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (response.ok) {
        if(paymentData.serviceName === "Pro-Membership") {
            router.push('/(user)/pro-onboarding');
        } else if (paymentData.serviceName === "Valuation Service") {
            router.push('/(user)/valuation-onboarding');
        } else if (paymentData.serviceName === "Exit Strategy (NavArambh)") {
            router.push('/(user)/navarambh-onboarding');
        } else if (paymentData.serviceName === "Plant and Machinery") {
            router.push('/(user)/plant-machinery-onboarding');
        } else if (paymentData.serviceName === "Advertise Your Business") {
            router.push('/(user)/advertisement-onboarding');
        }
        return { success: true, paymentId: data.paymentId };
      } else {
        return { success: false, error: data.error || 'Wallet payment failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  },

  async initiatePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    if (!RAZORPAY_KEY_ID) {
      return { success: false, error: 'Razorpay Key ID is not configured. Please set EXPO_PUBLIC_RAZORPAY_KEY_ID.' };
    }
    
    try {
      // Create order
      const orderData = await this.createOrder(paymentData.amount);
      if (!orderData) {
        return { success: false, error: 'Failed to create payment order' };
      }

      // Get user data for prefill
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      // Razorpay options
      const options = {
        description: paymentData.description || `Payment for ${paymentData.serviceName}`,
        image: 'https://placehold.co/256x256/1e2a4a/fafafa.png?text=M', // Placeholder logo
        currency: 'INR',
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount, // Already in paise from createOrder
        name: 'MSMEConnect',
        order_id: orderData.orderId,
        prefill: {
          email: user?.email || '',
          contact: '', // Prefill phone if available
          name: user?.name || 'Valued Customer',
        },
        theme: {
          color: '#1e2a4a', // primary color
        },
      };

      // Open Razorpay checkout
      const result = await RazorpayCheckout.open(options);
      
      // Verify payment
      const isVerified = await this.verifyPayment({
        razorpay_payment_id: result.razorpay_payment_id,
        razorpay_order_id: result.razorpay_order_id,
        razorpay_signature: result.razorpay_signature,
        serviceName: paymentData.serviceName,
        amount: orderData.amount,
      });

      if (isVerified) {
        if(paymentData.serviceName === "Pro-Membership") {
            router.push('/(user)/pro-onboarding');
        } else if (paymentData.serviceName === "Valuation Service") {
            router.push('/(user)/valuation-onboarding');
        } else if (paymentData.serviceName === "Exit Strategy (NavArambh)") {
            router.push('/(user)/navarambh-onboarding');
        } else if (paymentData.serviceName === "Plant and Machinery") {
            router.push('/(user)/plant-machinery-onboarding');
        } else if (paymentData.serviceName === "Advertise Your Business") {
            router.push('/(user)/advertisement-onboarding');
        }
        return { success: true, paymentId: result.razorpay_payment_id };
      } else {
        return { success: false, error: 'Payment verification failed' };
      }
    } catch (error: any) {
      // Razorpay error codes: 0 for network, 1 for cancelled, 2 for error
      if (error.code === 1) { // PAYMENT_CANCELLED
        return { success: false, error: 'Payment was cancelled' };
      } else if (error.code === 2) {
        return { success: false, error: error.description || 'An unknown Razorpay error occurred' };
      } else {
        return { success: false, error: error.description || 'Payment failed due to a network error' };
      }
    }
  },
};
