
"use client";

import { toast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";

async function fetcher(url: string, options?: RequestInit) {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "An API error occurred");
        }
        return res.json();
    } catch (error: any) {
        toast({
            title: "API Error",
            description: error.message,
            variant: "destructive",
        });
        return null;
    }
}

// Data types from Prisma
export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface LoanApplication {
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
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
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
    };
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


export interface AdminDashboardData {
    totalRevenue: number;
    totalUsers: number;
    totalLoans: number;
    totalEnquiries: number;
    recentLoans: LoanApplication[];
    recentUsers: User[];
}

export interface Enquiry {
    id: string;
    name: string;
    email: string;
    subject: string;
    status: string;
    createdAt: string;
}

export interface PaymentTransaction {
    id: string;
    serviceName: string;
    amount: number;
    status: string;
    createdAt: string;
    razorpayPaymentId: string;
    user: {
        name: string;
        email: string;
    };
}

export interface UserWithCounts {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isAgent: boolean;
    createdAt: string;
    _count: {
        loanApplications: number;
        enquiries: number;
    };
}

// API functions
export const getAdminDashboardData = (): Promise<AdminDashboardData | null> => fetcher("/api/admin/dashboard-data");
export const getEnquiries = (query: string = "", dateRange?: DateRange): Promise<Enquiry[] | null> => {
    const params = new URLSearchParams({ query });
    if(dateRange?.from) params.set('from', dateRange.from.toISOString());
    if(dateRange?.to) params.set('to', dateRange.to.toISOString());
    return fetcher(`/api/admin/enquiries?${params.toString()}`);
};
export const getLoanApplications = (query: string = ""): Promise<LoanApplication[] | null> => fetcher(`/api/admin/loans?query=${query}`);
export const getPayments = (query: string = ""): Promise<PaymentTransaction[] | null> => fetcher(`/api/admin/payments?query=${query}`);
export const getUsers = (query: string = "", role: string = "all"): Promise<UserWithCounts[] | null> => fetcher(`/api/admin/users?query=${query}&role=${role}`);
export const getRedemptionRequests = (query: string = ""): Promise<RedemptionRequest[] | null> => fetcher(`/api/admin/redemptions?query=${query}`);
export const getValuationRequests = (query: string = ""): Promise<ValuationRequest[] | null> => fetcher(`/api/admin/valuations?query=${query}`);
export const getNavArambhRequests = (query: string = ""): Promise<NavArambhRequest[] | null> => fetcher(`/api/admin/navarambh?query=${query}`);
export const getPlantAndMachineryRequests = (query: string = ""): Promise<PlantAndMachineryRequest[] | null> => fetcher(`/api/admin/plant-machinery?query=${query}`);
