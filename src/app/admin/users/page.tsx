
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
import { useEffect, useState } from 'react';
import { getUsers, UserWithCounts } from '@/lib/admin-api';
import { Skeleton } from '@/components/ui/skeleton';


export default function UsersPage() {
  const [users, setUsers] = useState<UserWithCounts[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await getUsers();
    if(result) {
        setUsers(result);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          A list of all registered users.
        </CardDescription>
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
                  <Badge variant={user.isAdmin ? 'destructive' : 'secondary'}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </Badge>
                </TableCell>
                <TableCell>{user._count.enquiries}</TableCell>
                <TableCell>{user._count.loanApplications}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
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
