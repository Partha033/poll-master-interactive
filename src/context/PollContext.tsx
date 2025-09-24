import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PollSystemState, Poll, Vote, Student, UserRole } from '@/types/polling';

interface PollContextType {
  state: PollSystemState;
  createPoll: (question: string, options: string[], timeLimit: number) => void;
  startPoll: (pollId: string) => void;
  endPoll: (pollId: string) => void;
  submitVote: (pollId: string, option: string, studentName: string) => void;
  setUserRole: (role: UserRole) => void;
  setStudentName: (name: string) => void;
  getPollResults: (pollId: string) => any;
  canCreateNewPoll: () => boolean;
}

type PollAction =
  | { type: 'CREATE_POLL'; payload: Poll }
  | { type: 'START_POLL'; payload: string }
  | { type: 'END_POLL'; payload: string }
  | { type: 'SUBMIT_VOTE'; payload: Vote }
  | { type: 'SET_USER_ROLE'; payload: UserRole }
  | { type: 'SET_STUDENT_NAME'; payload: string }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'LOAD_STATE'; payload: Partial<PollSystemState> };

const initialState: PollSystemState = {
  currentPoll: null,
  allPolls: [],
  votes: [],
  students: [],
  userRole: null,
  studentName: '',
  sessionId: Math.random().toString(36).substr(2, 9),
};

function pollReducer(state: PollSystemState, action: PollAction): PollSystemState {
  switch (action.type) {
    case 'CREATE_POLL':
      return {
        ...state,
        allPolls: [...state.allPolls, action.payload],
        currentPoll: action.payload,
      };
    
    case 'START_POLL':
      return {
        ...state,
        allPolls: state.allPolls.map(poll =>
          poll.id === action.payload
            ? { ...poll, isActive: true, startedAt: new Date() }
            : { ...poll, isActive: false }
        ),
        currentPoll: state.allPolls.find(poll => poll.id === action.payload) || null,
      };
    
    case 'END_POLL':
      return {
        ...state,
        allPolls: state.allPolls.map(poll =>
          poll.id === action.payload
            ? { ...poll, isActive: false }
            : poll
        ),
        currentPoll: state.currentPoll?.id === action.payload ? null : state.currentPoll,
      };
    
    case 'SUBMIT_VOTE':
      const existingStudentIndex = state.students.findIndex(
        student => student.name === action.payload.studentName
      );
      
      let updatedStudents = [...state.students];
      if (existingStudentIndex >= 0) {
        updatedStudents[existingStudentIndex] = {
          ...updatedStudents[existingStudentIndex],
          hasVoted: true,
          lastVote: action.payload,
        };
      } else {
        updatedStudents.push({
          name: action.payload.studentName,
          sessionId: state.sessionId,
          hasVoted: true,
          lastVote: action.payload,
        });
      }
      
      return {
        ...state,
        votes: [...state.votes, action.payload],
        students: updatedStudents,
      };
    
    case 'SET_USER_ROLE':
      return {
        ...state,
        userRole: action.payload,
      };
    
    case 'SET_STUDENT_NAME':
      return {
        ...state,
        studentName: action.payload,
      };
    
    case 'ADD_STUDENT':
      return {
        ...state,
        students: [...state.students.filter(s => s.name !== action.payload.name), action.payload],
      };
    
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
      };
    
    default:
      return state;
  }
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export function PollProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(pollReducer, initialState);

  // Persist state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('pollSystemState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pollSystemState', JSON.stringify(state));
  }, [state]);

  const createPoll = (question: string, options: string[], timeLimit: number) => {
    const poll: Poll = {
      id: Date.now().toString(),
      question,
      options,
      createdAt: new Date(),
      isActive: false,
      timeLimit,
    };
    dispatch({ type: 'CREATE_POLL', payload: poll });
  };

  const startPoll = (pollId: string) => {
    dispatch({ type: 'START_POLL', payload: pollId });
  };

  const endPoll = (pollId: string) => {
    dispatch({ type: 'END_POLL', payload: pollId });
  };

  const submitVote = (pollId: string, option: string, studentName: string) => {
    const vote: Vote = {
      pollId,
      studentName,
      option,
      timestamp: new Date(),
    };
    dispatch({ type: 'SUBMIT_VOTE', payload: vote });
  };

  const setUserRole = (role: UserRole) => {
    dispatch({ type: 'SET_USER_ROLE', payload: role });
  };

  const setStudentName = (name: string) => {
    dispatch({ type: 'SET_STUDENT_NAME', payload: name });
  };

  const getPollResults = (pollId: string) => {
    const poll = state.allPolls.find(p => p.id === pollId);
    if (!poll) return null;

    const pollVotes = state.votes.filter(v => v.pollId === pollId);
    const totalVotes = pollVotes.length;
    
    const results = poll.options.map(option => {
      const optionVotes = pollVotes.filter(v => v.option === option).length;
      return {
        option,
        votes: optionVotes,
        percentage: totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0,
      };
    });

    return {
      pollId,
      totalVotes,
      results,
      voters: pollVotes.map(v => v.studentName),
    };
  };

  const canCreateNewPoll = () => {
    const activePoll = state.allPolls.find(poll => poll.isActive);
    if (!activePoll) return true;
    
    // Check if all students have answered
    const pollVotes = state.votes.filter(v => v.pollId === activePoll.id);
    return pollVotes.length >= state.students.length && state.students.length > 0;
  };

  return (
    <PollContext.Provider
      value={{
        state,
        createPoll,
        startPoll,
        endPoll,
        submitVote,
        setUserRole,
        setStudentName,
        getPollResults,
        canCreateNewPoll,
      }}
    >
      {children}
    </PollContext.Provider>
  );
}

export function usePoll() {
  const context = useContext(PollContext);
  if (context === undefined) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
}