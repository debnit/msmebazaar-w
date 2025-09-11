
import { create } from 'zustand';

export interface PaymentService {
  id: string;
  name: string;
  description: string;
  price: number;
  features?: string[];
}

interface PaymentState {
  services: PaymentService[];
  selectedService: PaymentService | null;
  customAmount: number;
  setSelectedService: (service: PaymentService) => void;
  setCustomAmount: (amount: number) => void;
  resetPayment: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  services: [
    { 
      id: '1', 
      name: "Pro-Membership", 
      description: "Unlock exclusive features and support.", 
      price: 99,
      features: [
        "24/7 Free Consultation",
        "Expert Mentoring",
        "Assistance to Sell Products",
        "Raw Material Procurement Support"
      ]
    },
    { 
      id: '2', 
      name: "Valuation Service", 
      description: "Get a professional valuation for your business.", 
      price: 199,
      features: [
          "Upload Balance Sheet (optional)",
          "Upload GST Returns (optional)",
          "Fill in asset and liability details",
          "Our team will provide a detailed report"
      ]
    },
    { id: '3', name: "Exit Strategy (NavArambh)", description: "Plan your business exit with expert guidance.", price: 299 }
  ],
  selectedService: null,
  customAmount: 0,

  setSelectedService: (service: PaymentService) => {
    set({ selectedService: service, customAmount: 0 });
  },

  setCustomAmount: (amount: number) => {
    set({ customAmount: amount, selectedService: null });
  },

  resetPayment: () => {
    set({ selectedService: null, customAmount: 0 });
  },
}));
