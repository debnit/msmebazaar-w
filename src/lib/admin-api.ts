
"use client";

import { toast } from "@/hooks/use-toast";

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
    createdAt: string;
    _count: {
        loanApplications: number;
        enquiries: number;
    };
}

// API functions
export const getAdminDashboardData = (): Promise<AdminDashboardData | null> => fetcher("/api/admin/dashboard-data");
export const getEnquiries = (): Promise<Enquiry[] | null> => fetcher("/api/admin/enquiries");
export const getLoanApplications = (): Promise<LoanApplication[] | null> => fetcher("/api/admin/loans");
export const getPayments = (): Promise<PaymentTransaction[] | null> => fetcher("/api/admin/payments");
export const getUsers = (): Promise<UserWithCounts[] | null> => fetcher("/api/admin/users");
