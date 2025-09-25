export interface Assessment {
  id: string;
  question: string;
  options: string[];
  createdAt: Date;
  isActive: boolean;
  timeLimit: number; // in seconds
  startedAt?: Date;
  endedAt?: Date;
  totalParticipants?: number;
}

export interface Answer {
  assessmentId: string;
  studentName: string;
  option: string;
  timestamp: Date;
  isCorrect?: boolean;
}

export interface Student {
  name: string;
  sessionId: string;
  hasAnswered: boolean;
  lastAnswer?: Answer;
  joinedAt: Date;
  isOnline: boolean;
}

export interface AssessmentResults {
  assessmentId: string;
  totalAnswers: number;
  results: {
    option: string;
    answers: number;
    percentage: number;
  }[];
  participants: string[];
  attendanceRate: number;
}

export interface AttendanceData {
  totalStudents: number;
  participatedStudents: number;
  attendanceRate: number;
  studentList: {
    name: string;
    participated: boolean;
    joinedAt?: Date;
    answeredAt?: Date;
  }[];
}

export type UserRole = 'teacher' | 'student' | null;

export interface AssessmentSystemState {
  currentAssessment: Assessment | null;
  allAssessments: Assessment[];
  answers: Answer[];
  students: Student[];
  userRole: UserRole;
  studentName: string;
  sessionId: string;
}