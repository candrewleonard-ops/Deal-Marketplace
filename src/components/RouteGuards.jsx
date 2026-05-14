import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guards a route — guests are bounced to the marketplace and the DM
 * showcase modal is opened automatically (so they see why they should
 * sign up rather than landing on an empty wall).
 *
 * Use this on routes that only make sense for signed-in users (Messages).
 */
export function DMGuard({ children, placement = 'route' }) {
  const { isAuthenticated, requireAuthForDM } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) requireAuthForDM(placement);
  }, [isAuthenticated, requireAuthForDM, placement]);

  if (!isAuthenticated) return <Navigate to="/marketplace" replace />;
  return children;
}

/**
 * Generic auth guard — guests are bounced to /marketplace and the standard
 * AuthPromptModal is opened. Use for routes where the user must be signed
 * in but DM-specific conversion copy isn't appropriate.
 */
export function AuthGuard({ children, reason = 'view this page', redirectTo = '/marketplace' }) {
  const { isAuthenticated, requireAuth } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) requireAuth(reason, 'route', redirectTo);
  }, [isAuthenticated, requireAuth, reason, redirectTo]);

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
  return children;
}
