
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, UserX } from 'lucide-react';

interface UserAgentUpdaterProps {
  userId: string;
  isAgent: boolean;
  onUpdate: () => void;
}

export function UserAgentUpdater({ userId, isAgent, onUpdate }: UserAgentUpdaterProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}/agent`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAgent: !isAgent }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `User agent status updated successfully.`,
        });
        onUpdate();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to update user status.',
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
    <Button
      variant="outline"
      size="sm"
      onClick={handleRoleChange}
      disabled={isUpdating}
    >
      {isAgent ? (
        <>
          <UserX className="mr-2 h-4 w-4" />
          Remove Agent
        </>
      ) : (
        <>
          <UserCheck className="mr-2 h-4 w-4" />
          Make Agent
        </>
      )}
    </Button>
  );
}
