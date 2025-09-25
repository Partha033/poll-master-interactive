import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAssessment } from '@/context/AssessmentContext';
import { AssessmentResults } from '@/components/PollResults';
import { Timer } from '@/components/Timer';
import { NavigationHeader } from '@/components/ui/navigation';
import { User, CheckSquare, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function StudentInterface() {
  const { state, setStudentName, submitAnswer, resetUserRole, joinSession } = useAssessment();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tempName, setTempName] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const activeAssessment = state.allAssessments.find(assessment => assessment.isActive);
  const studentAnswer = activeAssessment ? state.answers.find(
    answer => answer.assessmentId === activeAssessment.id && answer.studentName === state.studentName
  ) : null;

  const handleBackToRoleSelection = () => {
    resetUserRole();
    navigate('/');
  };

  useEffect(() => {
    if (activeAssessment && studentAnswer) {
      setHasSubmitted(true);
    } else {
      setHasSubmitted(false);
      setTimeUp(false);
    }
  }, [activeAssessment, studentAnswer]);

  const handleNameSubmit = () => {
    if (!tempName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    setStudentName(tempName.trim());
    joinSession(tempName.trim());
    toast({
      title: "Welcome!",
      description: `Hello ${tempName.trim()}! You're now ready to participate in assessments.`,
    });
  };

  const handleAnswerSubmit = () => {
    if (!selectedOption || !activeAssessment) return;

    submitAnswer(activeAssessment.id, selectedOption, state.studentName);
    setHasSubmitted(true);
    setSelectedOption('');
    toast({
      title: "Answer Submitted!",
      description: "Your answer has been recorded successfully.",
    });
  };

  const handleTimeUp = () => {
    setTimeUp(true);
    toast({
      title: "Time's Up!",
      description: "The assessment period has ended. Showing results...",
      variant: "destructive",
    });
  };

  // Name entry screen
  if (!state.studentName) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-success" />
            </div>
            <CardTitle className="text-2xl">Welcome Student!</CardTitle>
            <p className="text-muted-foreground">
              Enter your name to join the live assessment session
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
              />
            </div>
            <Button 
              onClick={handleNameSubmit} 
              className="w-full" 
              size="lg"
              disabled={!tempName.trim()}
            >
              Join Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader
        title="Student Dashboard"
        subtitle={`Welcome, ${state.studentName}!`}
        showBackButton={true}
        onBack={handleBackToRoleSelection}
        userRole="student"
        userName={state.studentName}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Active Assessment or Waiting */}
          {activeAssessment ? (
            <Card className="shadow-lg border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="w-5 h-5" />
                      Active Assessment
                    </CardTitle>
                    <Badge variant="default">Live</Badge>
                  </div>
                  {!hasSubmitted && !timeUp && (
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">{activeAssessment.question}</h3>
                  
                  {/* Timer */}
                  {!hasSubmitted && !timeUp && (
                    <Timer
                      duration={activeAssessment.timeLimit}
                      isActive={true}
                      onComplete={handleTimeUp}
                    />
                  )}
                </div>

                {/* Assessment Options */}
                {!hasSubmitted && !timeUp ? (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Choose your answer:</Label>
                    <div className="grid gap-3">
                      {activeAssessment.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={selectedOption === option ? "default" : "poll"}
                          className="justify-start text-left h-auto p-4"
                          onClick={() => setSelectedOption(option)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedOption === option 
                                ? 'bg-primary border-primary-foreground' 
                                : 'border-border'
                            }`} />
                            <span>{option}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={handleAnswerSubmit}
                      disabled={!selectedOption}
                      className="w-full mt-4"
                      size="lg"
                    >
                      Submit Answer
                    </Button>
                  </div>
                ) : (
                  /* Show Results */
                  <div className="space-y-4">
                    {hasSubmitted && (
                      <div className="flex items-center gap-2 text-success bg-success-light p-3 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">
                          Your answer "{studentAnswer?.option}" has been recorded!
                        </span>
                      </div>
                    )}
                    
                    {timeUp && !hasSubmitted && (
                      <div className="flex items-center gap-2 text-destructive bg-destructive-light p-3 rounded-lg">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">
                          Time expired! You didn't submit an answer in time.
                        </span>
                      </div>
                    )}
                    
                    <AssessmentResults assessmentId={activeAssessment.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* No Active Assessment */
            <Card className="shadow-md">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Active Assessment</h3>
                <p className="text-muted-foreground">
                  Wait for your teacher to start a new assessment. When they do, it will appear here automatically.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Assessment History */}
          {state.allAssessments.length > 0 && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Previous Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {state.allAssessments
                    .filter(assessment => !assessment.isActive)
                    .map((assessment) => {
                      const userAnswer = state.answers.find(
                        answer => answer.assessmentId === assessment.id && answer.studentName === state.studentName
                      );
                      return (
                        <div key={assessment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{assessment.question}</h4>
                            <Badge variant={userAnswer ? "success" : "secondary"}>
                              {userAnswer ? "Participated" : "Missed"}
                            </Badge>
                          </div>
                          {userAnswer && (
                            <p className="text-sm text-muted-foreground">
                              Your answer: <span className="font-medium">{userAnswer.option}</span>
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}