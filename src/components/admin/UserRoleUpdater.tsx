
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShieldOff } from 'lucide-react';

interface UserRoleUpdaterProps {
  userId: string;
  isAdmin: boolean;
  onUpdate: () => void;
}

export function UserRoleUpdater({ userId, isAdmin, onUpdate }: UserRoleUpdaterProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: !isAdmin }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `User role updated successfully.`,
        });
        onUpdate();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to update user role.',
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
      {isAdmin ? (
        <>
          <ShieldOff className="mr-2 h-4 w-4" />
          Remove Admin
        </>
      ) : (
        <>
          <Shield className="mr-2 h-4 w-4" />
          Make Admin
        </>
      )}
    </Button>
  );
}
