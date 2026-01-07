import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm font-medium">
        <span className="text-muted-foreground">
          Question {current} of {total}
        </span>
        <span className="text-primary">{percentage}% complete</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full progress-gradient rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
