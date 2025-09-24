import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface TimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  isActive: boolean;
}

export function Timer({ duration, onComplete, isActive }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) return;

    setTimeLeft(duration);
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onComplete, isActive]);

  const progress = ((duration - timeLeft) / duration) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
        <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-destructive' : 'text-foreground'}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      <Progress 
        value={progress} 
        className={`h-2 transition-colors ${timeLeft <= 10 ? 'bg-destructive-light' : ''}`}
      />
      {timeLeft <= 10 && (
        <p className="text-sm text-destructive animate-pulse">
          Hurry up! Time is running out!
        </p>
      )}
    </div>
  );
}