import { cn } from '@/lib/utils';
import { Briefcase } from 'lucide-react';

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Briefcase className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold text-foreground">
        MSMEConnect
      </span>
    </div>
  );
};

export default Logo;
