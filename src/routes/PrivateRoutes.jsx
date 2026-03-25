import { Navigate, Outlet } from 'react-router-dom';
import useAuthReducer from '../stores/AuthReducer';

function PrivateRoutes() {
  const { isAuthenticated } = useAuthReducer((state) => state);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoutes;
