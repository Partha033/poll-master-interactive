import { usePoll } from '@/context/PollContext';
import RoleSelection from './RoleSelection';
import TeacherDashboard from './TeacherDashboard';
import StudentInterface from './StudentInterface';

const Index = () => {
  const { state } = usePoll();

  // Show role selection if no role is chosen
  if (!state.userRole) {
    return <RoleSelection />;
  }

  // Show appropriate dashboard based on role
  if (state.userRole === 'teacher') {
    return <TeacherDashboard />;
  }

  if (state.userRole === 'student') {
    return <StudentInterface />;
  }

  return <RoleSelection />;
};

export default Index;
