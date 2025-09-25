import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssessment } from '@/context/AssessmentContext';
import { GraduationCap, Users } from 'lucide-react';

export default function RoleSelection() {
  const { setUserRole } = useAssessment();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    setUserRole(role);
    navigate(role === 'teacher' ? '/teacher' : '/student');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Live Assessment System
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Interactive platform for teachers to create assessments and track student attendance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Teacher Portal</CardTitle>
              <CardDescription className="text-base">
                Create assessments, manage tests, and track student attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Create multiple choice assessments</li>
                <li>• Set custom time limits</li>
                <li>• Track student attendance</li>
                <li>• View live results and analytics</li>
              </ul>
              <Button 
                variant="hero" 
                size="xl" 
                className="w-full"
                onClick={() => handleRoleSelect('teacher')}
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
              <CardTitle className="text-2xl">Student Portal</CardTitle>
              <CardDescription className="text-base">
                Join assessments, take tests, and view your results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Enter your name to participate</li>
                <li>• Take live assessments</li>
                <li>• View results after submission</li>
                <li>• Track your assessment history</li>
              </ul>
              <Button 
                variant="success" 
                size="xl" 
                className="w-full"
                onClick={() => handleRoleSelect('student')}
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