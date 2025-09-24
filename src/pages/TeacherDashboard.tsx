import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { usePoll } from '@/context/PollContext';
import { PollResults } from '@/components/PollResults';
import { Plus, Play, Square, Users, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TeacherDashboard() {
  const { state, createPoll, startPoll, endPoll, canCreateNewPoll } = usePoll();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    timeLimit: 60,
  });

  const handleCreatePoll = () => {
    if (!newPoll.question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    const validOptions = newPoll.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: "Error",
        description: "Please provide at least 2 options",
        variant: "destructive",
      });
      return;
    }

    createPoll(newPoll.question, validOptions, newPoll.timeLimit);
    setNewPoll({ question: '', options: ['', ''], timeLimit: 60 });
    setIsCreating(false);
    toast({
      title: "Success",
      description: "Poll created successfully!",
    });
  };

  const addOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const removeOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt),
    }));
  };

  const handleStartPoll = (pollId: string) => {
    startPoll(pollId);
    toast({
      title: "Poll Started",
      description: "Students can now vote on this poll",
    });
  };

  const handleEndPoll = (pollId: string) => {
    endPoll(pollId);
    toast({
      title: "Poll Ended",
      description: "Voting has been closed for this poll",
    });
  };

  const activePoll = state.allPolls.find(poll => poll.isActive);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
              <p className="text-muted-foreground">Create and manage your live polls</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{state.students.length} Students</span>
              </div>
              {canCreateNewPoll() ? (
                <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Poll
                </Button>
              ) : (
                <Badge variant="secondary">
                  Wait for all students to vote
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Poll Form */}
            {isCreating && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Create New Poll</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Textarea
                      id="question"
                      placeholder="Enter your poll question..."
                      value={newPoll.question}
                      onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>Options</Label>
                    <div className="space-y-2">
                      {newPoll.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                          />
                          {newPoll.options.length > 2 && (
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
                      value={newPoll.timeLimit}
                      onChange={(e) => setNewPoll(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreatePoll}>Create Poll</Button>
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active Poll */}
            {activePoll && (
              <Card className="shadow-md border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="w-5 h-5" />
                        Active Poll
                      </CardTitle>
                      <Badge variant="default">Live</Badge>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleEndPoll(activePoll.id)}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      End Poll
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <PollResults pollId={activePoll.id} />
                </CardContent>
              </Card>
            )}

            {/* Poll History */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>All Polls</CardTitle>
              </CardHeader>
              <CardContent>
                {state.allPolls.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No polls created yet. Create your first poll to get started!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {state.allPolls.map((poll) => (
                      <div key={poll.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{poll.question}</h4>
                            <p className="text-sm text-muted-foreground">
                              Created: {poll.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={poll.isActive ? "default" : "secondary"}>
                              {poll.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {!poll.isActive && (
                              <Button
                                size="sm"
                                onClick={() => handleStartPoll(poll.id)}
                                disabled={!!activePoll}
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
                  <span>Total Polls:</span>
                  <Badge variant="outline">{state.allPolls.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Active Students:</span>
                  <Badge variant="outline">{state.students.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Votes:</span>
                  <Badge variant="outline">{state.votes.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Active Students */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Active Students</CardTitle>
              </CardHeader>
              <CardContent>
                {state.students.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No students joined yet</p>
                ) : (
                  <div className="space-y-2">
                    {state.students.map((student, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{student.name}</span>
                        <Badge variant={student.hasVoted ? "success" : "secondary"} className="text-xs">
                          {student.hasVoted ? "Voted" : "Waiting"}
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