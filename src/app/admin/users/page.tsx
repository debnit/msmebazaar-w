
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
import { UserRoleUpdater } from '@/components/admin/UserRoleUpdater'
import { useEffect, useState, useCallback } from 'react';
import { getUsers, UserWithCounts } from '@/lib/admin-api';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { UserAgentUpdater } from '@/components/admin/UserAgentUpdater';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const result = await getUsers(debouncedSearchQuery, roleFilter);
    if(result) {
        setUsers(result);
    }
    setLoading(false);
  }, [debouncedSearchQuery, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          A list of all registered users.
        </CardDescription>
         <div className="pt-4 flex gap-4">
            <Input 
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                    <SelectItem value="agent">Agents</SelectItem>
                    <SelectItem value="user">Regular Users</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Enquiries</TableHead>
              <TableHead>Loans</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-9 w-28" /></TableCell>
                    </TableRow>
                ))
            ) : users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex flex-col gap-2'>
                    {user.isAdmin && <Badge variant={'destructive'}>Admin</Badge>}
                    {user.isAgent && <Badge variant={'outline'}>Agent</Badge>}
                    {!user.isAdmin && !user.isAgent && <Badge variant={'secondary'}>User</Badge>}
                  </div>
                </TableCell>
                <TableCell>{user._count.enquiries}</TableCell>
                <TableCell>{user._count.loanApplications}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <UserAgentUpdater userId={user.id} isAgent={user.isAgent} onUpdate={fetchUsers} />
                  <UserRoleUpdater userId={user.id} isAdmin={user.isAdmin} onUpdate={fetchUsers} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
