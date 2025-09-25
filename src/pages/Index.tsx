import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/context/AssessmentContext';
import RoleSelection from './RoleSelection';

const Index = () => {
  const { state } = useAssessment();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user role
    if (state.userRole === 'teacher') {
      navigate('/teacher');
    } else if (state.userRole === 'student') {
      navigate('/student');
    }
  }, [state.userRole, navigate]);

  return <RoleSelection />;
};

export default Index;
