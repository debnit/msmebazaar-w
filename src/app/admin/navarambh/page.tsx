
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useEffect, useState, useCallback } from 'react';
import { getNavArambhRequests, NavArambhRequest } from '@/lib/admin-api';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Custom hook for debouncing
function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export default function NavArambhPage() {
  const [requests, setRequests] = useState<NavArambhRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const result = await getNavArambhRequests(debouncedSearchQuery);
    if(result) {
      setRequests(result);
    }
    setLoading(false);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>NavArambh Requests</CardTitle>
        <CardDescription>
          Manage user requests for the NavArambh exit strategy service.
        </CardDescription>
        <div className="pt-4">
            <Input 
                placeholder="Search by user name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
            />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Asset Details</TableHead>
              <TableHead>Turnover Details</TableHead>
              <TableHead>Loan Details</TableHead>
              <TableHead>Problem Details</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>
                  <div className="font-medium">{req.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {req.user.email}
                  </div>
                   <div className="text-sm text-muted-foreground">
                    {req.contactDetails}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">{req.assetDetails}</TableCell>
                <TableCell className="max-w-xs truncate">{req.turnoverDetails}</TableCell>
                <TableCell className="max-w-xs truncate">{req.loanDetails}</TableCell>
                <TableCell className="max-w-xs truncate">{req.problemDetails}</TableCell>
                <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Mark Contacted</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
