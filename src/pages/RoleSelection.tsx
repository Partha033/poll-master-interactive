import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePoll } from '@/context/PollContext';
import { GraduationCap, Users } from 'lucide-react';

export default function RoleSelection() {
  const { setUserRole } = usePoll();

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Live Polling System
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Engage your audience with real-time interactive polls. Choose your role to get started.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Teacher</CardTitle>
              <CardDescription className="text-base">
                Create and manage live polls, view real-time results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Create multiple choice polls</li>
                <li>• Set custom time limits</li>
                <li>• View live voting results</li>
                <li>• Manage student participation</li>
              </ul>
              <Button 
                variant="hero" 
                size="xl" 
                className="w-full"
                onClick={() => setUserRole('teacher')}
              >
                Start as Teacher
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-success" />
              </div>
              <CardTitle className="text-2xl">Student</CardTitle>
              <CardDescription className="text-base">
                Join live polls and submit your answers in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Enter your name to participate</li>
                <li>• Vote on active polls</li>
                <li>• View results after voting</li>
                <li>• 60-second time limit per poll</li>
              </ul>
              <Button 
                variant="success" 
                size="xl" 
                className="w-full"
                onClick={() => setUserRole('student')}
              >
                Join as Student
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}