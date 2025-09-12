
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
          "Upload Annual GST Returns (optional)",
          "Fill in asset and liability details",
          "Our team provides a detailed report"
      ]
    },
    { 
        id: '3', 
        name: "Exit Strategy (NavArambh)", 
        description: "Plan your business exit with expert guidance.", 
        price: 299,
        features: [
            "Fill in Asset, Turnover & Loan Details",
            "Describe your business challenges",
            "Get a call from our expert team in 5 mins",
            "Comprehensive exit strategy report"
        ]
    },
    {
      id: '4',
      name: "Plant and Machinery",
      description: "Buy, sell, or lease equipment with our help.",
      price: 99,
      features: [
        "Turnkey Project Setup",
        "Buy/Lease/Sell Plant & Machinery",
        "Free Consultation",
        "Expert Help",
      ]
    },
    {
      id: '5',
      name: "Advertise Your Business",
      description: "Boost your online presence and reach more customers.",
      price: 99,
      features: [
        "Provide Business Name & Nature",
        "Fill in Business Address",
        "Fill in Contact Details",
        "Upload Photos & Videos (Optional)",
        "Our team will contact you for your online presence"
      ]
    }
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
