import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@features/auth';

export const ProtectedRoute = () => {
  const token = useAuthStore((s) => s.accessToken);
  return token ? <Outlet/> : <Navigate to="/login" replace/>;
};