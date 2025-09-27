import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

function PrivateRoute({ children }) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const role = userProfile?.user_type || userProfile?.userType;
  if (userProfile && role !== 'seller') {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
