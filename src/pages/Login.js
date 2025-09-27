import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  useTheme
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect based on user type or to home page
        navigate('/');
      } else {
        setError(result.error || 'Failed to log in');
      }
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase' }}>
          Welcome Back
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Sign in to your account to continue
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 400, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Don't have an account?{' '}
          <Button
            onClick={() => navigate('/register')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Sign up here
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;
