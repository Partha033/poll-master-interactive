import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, User, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  userRole?: 'teacher' | 'student' | null;
  userName?: string;
}

export function NavigationHeader({
  title,
  subtitle,
  showBackButton = false,
  onBack,
  userRole,
  userName
}: NavigationHeaderProps) {
  return (
    <div className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                {userRole === 'teacher' && <GraduationCap className="w-8 h-8 text-primary" />}
                {userRole === 'student' && <User className="w-8 h-8 text-success" />}
                {!userRole && <Home className="w-8 h-8 text-primary" />}
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          
          {userName && (
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                userRole === 'teacher' ? "bg-primary text-primary-foreground" : "bg-success text-success-foreground"
              )}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackButton({ onClick, className }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn("flex items-center gap-2 mb-4", className)}
    >
      <ArrowLeft className="w-4 h-4" />
      Go Back
    </Button>
  );
}