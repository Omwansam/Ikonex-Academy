import { useAuth } from '../context/AuthContext';

export function useStudentId() {
  const { user } = useAuth();
  return user?.studentId || null;
}
