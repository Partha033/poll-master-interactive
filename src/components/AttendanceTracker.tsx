import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAssessment } from '@/context/AssessmentContext';
import { AttendanceData } from '@/types/polling';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AttendanceTrackerProps {
  assessmentId: string;
}

export function AttendanceTracker({ assessmentId }: AttendanceTrackerProps) {
  const { getAttendanceData, state } = useAssessment();
  const attendanceData = getAttendanceData(assessmentId);
  const assessment = state.allAssessments.find(a => a.id === assessmentId);

  if (!assessment) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Assessment not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Attendance Tracker
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {attendanceData.participatedStudents}/{attendanceData.totalStudents} Participated
          </Badge>
          <Badge 
            variant={attendanceData.attendanceRate >= 75 ? "success" : attendanceData.attendanceRate >= 50 ? "default" : "destructive"}
          >
            {attendanceData.attendanceRate}% Attendance Rate
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{attendanceData.totalStudents}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <UserCheck className="w-4 h-4 text-success" />
              <span className="text-2xl font-bold text-success">{attendanceData.participatedStudents}</span>
            </div>
            <p className="text-sm text-muted-foreground">Participated</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <UserX className="w-4 h-4 text-destructive" />
              <span className="text-2xl font-bold text-destructive">
                {attendanceData.totalStudents - attendanceData.participatedStudents}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Missed</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Student Details:</h4>
          {attendanceData.studentList.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              No students have joined yet
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {attendanceData.studentList.map((student, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      student.participated 
                        ? 'bg-success text-success-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{student.name}</p>
                      {student.joinedAt && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Joined {formatDistanceToNow(student.joinedAt, { addSuffix: true })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={student.participated ? "success" : "secondary"}
                      className="text-xs"
                    >
                      {student.participated ? "Participated" : "Pending"}
                    </Badge>
                    {student.answeredAt && (
                      <Badge variant="outline" className="text-xs">
                        {formatDistanceToNow(student.answeredAt, { addSuffix: true })}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}