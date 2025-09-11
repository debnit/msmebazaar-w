
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
import { getRedemptionRequests, RedemptionRequest } from '@/lib/admin-api';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { RedemptionStatusUpdater } from '@/components/admin/RedemptionStatusUpdater';

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

export default function RedemptionsPage() {
  const [requests, setRequests] = useState<RedemptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const result = await getRedemptionRequests(debouncedSearchQuery);
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
        <CardTitle>Redemption Requests</CardTitle>
        <CardDescription>
          Manage user requests to redeem wallet balances.
        </CardDescription>
        <div className="pt-4">
            <Input 
                placeholder="Search by user name, email, or method..."
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
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>
                  <div className="font-medium">{req.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {req.user.email}
                  </div>
                </TableCell>
                <TableCell>₹{req.amount.toLocaleString()}</TableCell>
                <TableCell>{req.method}</TableCell>
                <TableCell className='font-mono text-xs'>{req.details}</TableCell>
                <TableCell>
                  <Badge
                     variant={
                        req.status === 'Completed' ? 'default'
                        : req.status === 'Failed' ? 'destructive'
                        : 'secondary'
                      }
                      className={req.status === 'Completed' ? 'bg-green-500' : ''}
                  >
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <RedemptionStatusUpdater requestId={req.id} currentStatus={req.status} onUpdate={fetchRequests} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
