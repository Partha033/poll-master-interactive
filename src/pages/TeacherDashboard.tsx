import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAssessment } from '@/context/AssessmentContext';
import { AssessmentResults } from '@/components/PollResults';
import { AttendanceTracker } from '@/components/AttendanceTracker';
import { NavigationHeader } from '@/components/ui/navigation';
import { Plus, Play, Square, Users, BarChart, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TeacherDashboard() {
  const { state, createAssessment, startAssessment, endAssessment, canCreateNewAssessment, resetUserRole } = useAssessment();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    question: '',
    options: ['', ''],
    timeLimit: 60,
  });

  const handleBackToRoleSelection = () => {
    resetUserRole();
    navigate('/');
  };

  const handleCreateAssessment = () => {
    if (!newAssessment.question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    const validOptions = newAssessment.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: "Error",
        description: "Please provide at least 2 options",
        variant: "destructive",
      });
      return;
    }

    createAssessment(newAssessment.question, validOptions, newAssessment.timeLimit);
    setNewAssessment({ question: '', options: ['', ''], timeLimit: 60 });
    setIsCreating(false);
    toast({
      title: "Success",
      description: "Assessment created successfully!",
    });
  };

  const addOption = () => {
    setNewAssessment(prev => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const removeOption = (index: number) => {
    if (newAssessment.options.length > 2) {
      setNewAssessment(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setNewAssessment(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt),
    }));
  };

  const handleStartAssessment = (assessmentId: string) => {
    startAssessment(assessmentId);
    toast({
      title: "Assessment Started",
      description: "Students can now take this assessment",
    });
  };

  const handleEndAssessment = (assessmentId: string) => {
    endAssessment(assessmentId);
    toast({
      title: "Assessment Ended",
      description: "Assessment has been closed for submissions",
    });
  };

  const activeAssessment = state.allAssessments.find(assessment => assessment.isActive);

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader
        title="Teacher Dashboard"
        subtitle="Create and manage assessments, track student attendance"
        showBackButton={true}
        onBack={handleBackToRoleSelection}
        userRole="teacher"
        userName="Teacher"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{state.students.length} Students Online</span>
            </div>
          </div>
          {canCreateNewAssessment() ? (
            <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
              <Plus className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
          ) : (
            <Badge variant="secondary">
              Wait for all students to complete
            </Badge>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Assessment Form */}
            {isCreating && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Create New Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Textarea
                      id="question"
                      placeholder="Enter your assessment question..."
                      value={newAssessment.question}
                      onChange={(e) => setNewAssessment(prev => ({ ...prev, question: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>Options</Label>
                    <div className="space-y-2">
                      {newAssessment.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                          />
                          {newAssessment.options.length > 2 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeOption(index)}
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" onClick={addOption} className="mt-2">
                      Add Option
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      min="10"
                      max="300"
                      value={newAssessment.timeLimit}
                      onChange={(e) => setNewAssessment(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateAssessment}>Create Assessment</Button>
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active Assessment */}
            {activeAssessment && (
              <Card className="shadow-md border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="w-5 h-5" />
                        Active Assessment
                      </CardTitle>
                      <Badge variant="default">Live</Badge>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleEndAssessment(activeAssessment.id)}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      End Assessment
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AssessmentResults assessmentId={activeAssessment.id} />
                  <AttendanceTracker assessmentId={activeAssessment.id} />
                </CardContent>
              </Card>
            )}

            {/* Assessment History */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>All Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                {state.allAssessments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No assessments created yet. Create your first assessment to get started!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {state.allAssessments.map((assessment) => (
                      <div key={assessment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{assessment.question}</h4>
                            <p className="text-sm text-muted-foreground">
                              Created: {assessment.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={assessment.isActive ? "default" : "secondary"}>
                              {assessment.isActive ? "Active" : "Completed"}
                            </Badge>
                            {!assessment.isActive && !activeAssessment && (
                              <Button
                                size="sm"
                                onClick={() => handleStartAssessment(assessment.id)}
                              >
                                <Play className="w-4 h-4 mr-1" />
                                Start
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Assessments:</span>
                  <Badge variant="outline">{state.allAssessments.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Online Students:</span>
                  <Badge variant="outline">{state.students.filter(s => s.isOnline).length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Submissions:</span>
                  <Badge variant="outline">{state.answers.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Active Students */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Online Students</CardTitle>
              </CardHeader>
              <CardContent>
                {state.students.filter(s => s.isOnline).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No students online yet</p>
                ) : (
                  <div className="space-y-2">
                    {state.students.filter(s => s.isOnline).map((student, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{student.name}</span>
                        <Badge variant={student.hasAnswered ? "success" : "secondary"} className="text-xs">
                          {student.hasAnswered ? "Completed" : "Waiting"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}