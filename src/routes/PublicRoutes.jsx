import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthReducer from '../stores/AuthReducer';

function PublicRoutes() {
  const { isAuthenticated } = useAuthReducer((state) => state);

  return (
    <Suspense fallback={<div />}>
      {isAuthenticated ? (
        <Navigate to="/" replace />
      ) : (
        <div className="outer">
          <Outlet />
        </div>
      )}
    </Suspense>
  );
}

export default PublicRoutes;
