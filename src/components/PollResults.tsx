import { usePoll } from '@/context/PollContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface PollResultsProps {
  pollId: string;
}

export function PollResults({ pollId }: PollResultsProps) {
  const { getPollResults, state } = usePoll();
  const results = getPollResults(pollId);
  const poll = state.allPolls.find(p => p.id === pollId);

  if (!results || !poll) {
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
        <CardTitle className="text-xl">{poll.question}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{results.totalVotes} votes</Badge>
          <Badge variant="outline">{results.voters.length} participants</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {results.results.map((result, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{result.option}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {result.votes} votes
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
        
        {results.voters.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-2">Participants:</h4>
            <div className="flex flex-wrap gap-2">
              {results.voters.map((voter, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {voter}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}