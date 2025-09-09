import RazorpayCheckout from '@react-native-razorpay/react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5000/api'; // Update this to your backend URL
const RAZORPAY_KEY_ID = 'rzp_test_E1nhfx3UCW0qUi'; // Replace with your actual Razorpay key

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
  async createOrder(amount: number): Promise<{ orderId: string; amount: number } | null> {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        const data = await response.json();
        return { orderId: data.orderId, amount: data.amount };
      } else {
        throw new Error('Failed to create order');
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
    amount: number;
  }): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      return response.ok;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  },

  async initiatePayment(paymentData: PaymentData): Promise<PaymentResponse> {
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
        image: 'https://your-logo-url.com/logo.png', // Add your logo URL
        currency: 'INR',
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        name: 'MSMEConnect',
        order_id: orderData.orderId,
        prefill: {
          email: user?.email || 'user@example.com',
          contact: '8260895728',
          name: user?.name || 'User',
        },
        theme: {
          color: '#ff6b35', // Your brand color
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
        return { success: true, paymentId: result.razorpay_payment_id };
      } else {
        return { success: false, error: 'Payment verification failed' };
      }
    } catch (error: any) {
      if (error.code === 'PAYMENT_CANCELLED') {
        return { success: false, error: 'Payment was cancelled' };
      } else {
        return { success: false, error: error.message || 'Payment failed' };
      }
    }
  },
};
