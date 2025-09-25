import { useAssessment } from '@/context/AssessmentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface AssessmentResultsProps {
  assessmentId: string;
}

export function AssessmentResults({ assessmentId }: AssessmentResultsProps) {
  const { getAssessmentResults, state } = useAssessment();
  const results = getAssessmentResults(assessmentId);
  const assessment = state.allAssessments.find(a => a.id === assessmentId);

  if (!results || !assessment) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No results available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{assessment.question}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{results.totalAnswers} answers</Badge>
          <Badge variant="outline">{results.participants.length} participants</Badge>
          <Badge variant="success">{results.attendanceRate}% attendance</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.results.map((result, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{result.option}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {result.answers} answers
                </span>
                <Badge 
                  variant={result.percentage > 0 ? "default" : "secondary"}
                  className="min-w-[50px] justify-center"
                >
                  {result.percentage}%
                </Badge>
              </div>
            </div>
            <Progress 
              value={result.percentage} 
              className="h-3"
            />
          </div>
        ))}
        
        {results.participants.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-2">Participants ({results.participants.length}):</h4>
            <div className="flex flex-wrap gap-2">
              {results.participants.map((participant, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {participant}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Maintain backward compatibility
export const PollResults = AssessmentResults;