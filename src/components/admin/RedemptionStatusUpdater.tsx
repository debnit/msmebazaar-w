
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

interface RedemptionStatusUpdaterProps {
  requestId: string;
  currentStatus: string;
  onUpdate: () => void;
}

export function RedemptionStatusUpdater({ requestId, currentStatus, onUpdate }: RedemptionStatusUpdaterProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus || isUpdating) return;
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/redemptions/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Redemption status updated to ${newStatus}.`,
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
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={currentStatus === 'Completed' || currentStatus === 'Failed'}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleStatusChange('Completed')}
          disabled={isUpdating}
        >
          Mark as Completed
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange('Failed')}
          disabled={isUpdating}
          className="text-destructive"
        >
          Mark as Failed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
