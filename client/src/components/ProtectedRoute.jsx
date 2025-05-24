import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/isLoggedIn', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.loggedIn);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Auth check error:', err);
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-6">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
