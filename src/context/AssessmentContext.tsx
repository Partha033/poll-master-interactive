import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AssessmentSystemState, Assessment, Answer, Student, UserRole, AttendanceData } from '@/types/polling';

interface AssessmentContextType {
  state: AssessmentSystemState;
  createAssessment: (question: string, options: string[], timeLimit: number) => void;
  startAssessment: (assessmentId: string) => void;
  endAssessment: (assessmentId: string) => void;
  submitAnswer: (assessmentId: string, option: string, studentName: string) => void;
  setUserRole: (role: UserRole) => void;
  setStudentName: (name: string) => void;
  getAssessmentResults: (assessmentId: string) => any;
  getAttendanceData: (assessmentId: string) => AttendanceData;
  canCreateNewAssessment: () => boolean;
  resetUserRole: () => void;
  joinSession: (studentName: string) => void;
}

type AssessmentAction =
  | { type: 'CREATE_ASSESSMENT'; payload: Assessment }
  | { type: 'START_ASSESSMENT'; payload: string }
  | { type: 'END_ASSESSMENT'; payload: string }
  | { type: 'SUBMIT_ANSWER'; payload: Answer }
  | { type: 'SET_USER_ROLE'; payload: UserRole }
  | { type: 'SET_STUDENT_NAME'; payload: string }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'JOIN_SESSION'; payload: string }
  | { type: 'RESET_USER_ROLE' }
  | { type: 'LOAD_STATE'; payload: Partial<AssessmentSystemState> };

const initialState: AssessmentSystemState = {
  currentAssessment: null,
  allAssessments: [],
  answers: [],
  students: [],
  userRole: null,
  studentName: '',
  sessionId: Math.random().toString(36).substr(2, 9),
};

function assessmentReducer(state: AssessmentSystemState, action: AssessmentAction): AssessmentSystemState {
  switch (action.type) {
    case 'CREATE_ASSESSMENT':
      return {
        ...state,
        allAssessments: [...state.allAssessments, action.payload],
        currentAssessment: action.payload,
      };
    
    case 'START_ASSESSMENT':
      return {
        ...state,
        allAssessments: state.allAssessments.map(assessment =>
          assessment.id === action.payload
            ? { ...assessment, isActive: true, startedAt: new Date() }
            : { ...assessment, isActive: false }
        ),
        currentAssessment: state.allAssessments.find(assessment => assessment.id === action.payload) || null,
      };
    
    case 'END_ASSESSMENT':
      return {
        ...state,
        allAssessments: state.allAssessments.map(assessment =>
          assessment.id === action.payload
            ? { ...assessment, isActive: false, endedAt: new Date() }
            : assessment
        ),
        currentAssessment: state.currentAssessment?.id === action.payload ? null : state.currentAssessment,
      };
    
    case 'SUBMIT_ANSWER':
      const existingStudentIndex = state.students.findIndex(
        student => student.name === action.payload.studentName
      );
      
      let updatedStudents = [...state.students];
      if (existingStudentIndex >= 0) {
        updatedStudents[existingStudentIndex] = {
          ...updatedStudents[existingStudentIndex],
          hasAnswered: true,
          lastAnswer: action.payload,
        };
      } else {
        updatedStudents.push({
          name: action.payload.studentName,
          sessionId: state.sessionId,
          hasAnswered: true,
          lastAnswer: action.payload,
          joinedAt: new Date(),
          isOnline: true,
        });
      }
      
      return {
        ...state,
        answers: [...state.answers, action.payload],
        students: updatedStudents,
      };
    
    case 'JOIN_SESSION':
      const existingStudent = state.students.find(s => s.name === action.payload);
      if (existingStudent) {
        return {
          ...state,
          students: state.students.map(s =>
            s.name === action.payload
              ? { ...s, isOnline: true, joinedAt: new Date() }
              : s
          ),
        };
      }
      
      return {
        ...state,
        students: [...state.students, {
          name: action.payload,
          sessionId: state.sessionId,
          hasAnswered: false,
          joinedAt: new Date(),
          isOnline: true,
        }],
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
    
    case 'RESET_USER_ROLE':
      return {
        ...state,
        userRole: null,
        studentName: '',
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

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  // Persist state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('assessmentSystemState');
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
    localStorage.setItem('assessmentSystemState', JSON.stringify(state));
  }, [state]);

  const createAssessment = (question: string, options: string[], timeLimit: number) => {
    const assessment: Assessment = {
      id: Date.now().toString(),
      question,
      options,
      createdAt: new Date(),
      isActive: false,
      timeLimit,
    };
    dispatch({ type: 'CREATE_ASSESSMENT', payload: assessment });
  };

  const startAssessment = (assessmentId: string) => {
    dispatch({ type: 'START_ASSESSMENT', payload: assessmentId });
  };

  const endAssessment = (assessmentId: string) => {
    dispatch({ type: 'END_ASSESSMENT', payload: assessmentId });
  };

  const submitAnswer = (assessmentId: string, option: string, studentName: string) => {
    const answer: Answer = {
      assessmentId,
      studentName,
      option,
      timestamp: new Date(),
    };
    dispatch({ type: 'SUBMIT_ANSWER', payload: answer });
  };

  const setUserRole = (role: UserRole) => {
    dispatch({ type: 'SET_USER_ROLE', payload: role });
  };

  const setStudentName = (name: string) => {
    dispatch({ type: 'SET_STUDENT_NAME', payload: name });
  };

  const resetUserRole = () => {
    dispatch({ type: 'RESET_USER_ROLE' });
  };

  const joinSession = (studentName: string) => {
    dispatch({ type: 'JOIN_SESSION', payload: studentName });
  };

  const getAssessmentResults = (assessmentId: string) => {
    const assessment = state.allAssessments.find(a => a.id === assessmentId);
    if (!assessment) return null;

    const assessmentAnswers = state.answers.filter(a => a.assessmentId === assessmentId);
    const totalAnswers = assessmentAnswers.length;
    
    const results = assessment.options.map(option => {
      const optionAnswers = assessmentAnswers.filter(a => a.option === option).length;
      return {
        option,
        answers: optionAnswers,
        percentage: totalAnswers > 0 ? Math.round((optionAnswers / totalAnswers) * 100) : 0,
      };
    });

    return {
      assessmentId,
      totalAnswers,
      results,
      participants: assessmentAnswers.map(a => a.studentName),
      attendanceRate: totalAnswers > 0 ? Math.round((totalAnswers / state.students.length) * 100) : 0,
    };
  };

  const getAttendanceData = (assessmentId: string): AttendanceData => {
    const assessmentAnswers = state.answers.filter(a => a.assessmentId === assessmentId);
    const participatedStudents = new Set(assessmentAnswers.map(a => a.studentName));
    
    const studentList = state.students.map(student => ({
      name: student.name,
      participated: participatedStudents.has(student.name),
      joinedAt: student.joinedAt,
      answeredAt: student.lastAnswer?.timestamp,
    }));

    return {
      totalStudents: state.students.length,
      participatedStudents: participatedStudents.size,
      attendanceRate: state.students.length > 0 ? Math.round((participatedStudents.size / state.students.length) * 100) : 0,
      studentList,
    };
  };

  const canCreateNewAssessment = () => {
    const activeAssessment = state.allAssessments.find(assessment => assessment.isActive);
    if (!activeAssessment) return true;
    
    const assessmentAnswers = state.answers.filter(a => a.assessmentId === activeAssessment.id);
    return assessmentAnswers.length >= state.students.length && state.students.length > 0;
  };

  return (
    <AssessmentContext.Provider
      value={{
        state,
        createAssessment,
        startAssessment,
        endAssessment,
        submitAnswer,
        setUserRole,
        setStudentName,
        resetUserRole,
        joinSession,
        getAssessmentResults,
        getAttendanceData,
        canCreateNewAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}