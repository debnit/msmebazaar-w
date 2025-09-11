
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
import { Badge } from '@/components/ui/badge'
import { useEffect, useState, useCallback } from 'react';
import { getValuationRequests, ValuationRequest } from '@/lib/admin-api';
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

export default function ValuationsPage() {
  const [requests, setRequests] = useState<ValuationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const result = await getValuationRequests(debouncedSearchQuery);
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
        <CardTitle>Valuation Requests</CardTitle>
        <CardDescription>
          Manage user requests for business valuation.
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
              <TableHead>Turnover</TableHead>
              <TableHead>Assets</TableHead>
              <TableHead>Liabilities</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
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
                    {req.phone}
                  </div>
                </TableCell>
                <TableCell>₹{req.turnover.toLocaleString()}</TableCell>
                <TableCell className="max-w-xs truncate">{req.assets}</TableCell>
                <TableCell className="max-w-xs truncate">{req.liabilities}</TableCell>
                <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Send Report</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
