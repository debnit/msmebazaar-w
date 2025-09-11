
"use client";

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoanStatusUpdaterProps {
  loanId: string;
  currentStatus: string;
  onUpdate: () => void;
}

export function LoanStatusUpdater({ loanId, currentStatus, onUpdate }: LoanStatusUpdaterProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus || isUpdating) return;
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/loans/${loanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Loan status updated to ${newStatus}.`,
        });

        const updatedLoan = await response.json();

        // Also trigger a notification for the user
        await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: updatedLoan.userId,
              title: 'Loan Application Update',
              message: `Your loan application status has been updated to: ${newStatus}`,
            }),
          });
          
        onUpdate();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to update status.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleStatusChange('Pending')}
          disabled={currentStatus === 'Pending' || isUpdating}
        >
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange('Approved')}
          disabled={currentStatus === 'Approved' || isUpdating}
        >
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange('Rejected')}
          disabled={currentStatus === 'Rejected' || isUpdating}
          className="text-destructive"
        >
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
