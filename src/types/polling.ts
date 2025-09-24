export interface Poll {
  id: string;
  question: string;
  options: string[];
  createdAt: Date;
  isActive: boolean;
  timeLimit: number; // in seconds
  startedAt?: Date;
}

export interface Vote {
  pollId: string;
  studentName: string;
  option: string;
  timestamp: Date;
}

export interface Student {
  name: string;
  sessionId: string;
  hasVoted: boolean;
  lastVote?: Vote;
}

export interface PollResults {
  pollId: string;
  totalVotes: number;
  results: {
    option: string;
    votes: number;
    percentage: number;
  }[];
  voters: string[];
}

export type UserRole = 'teacher' | 'student' | null;

export interface PollSystemState {
  currentPoll: Poll | null;
  allPolls: Poll[];
  votes: Vote[];
  students: Student[];
  userRole: UserRole;
  studentName: string;
  sessionId: string;
}