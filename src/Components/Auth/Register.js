import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  Card,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../AuthContext';
import { authModalStyles } from '../../theme/authModalStyles';
import { useNavigate } from 'react-router-dom';

export default function Register({ onToggleAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password should be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/onboarding');
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.code === 'auth/email-already-in-use'
          ? 'Email is already registered'
          : error.code === 'auth/invalid-email'
          ? 'Invalid email address'
          : 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card sx={{ 
      p: 4, 
      maxWidth: 400, 
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Typography variant="h5" sx={{ 
        mb: 3, 
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
      }}>
        Create Your Account
      </Typography>
      {error && (
        <Alert severity="error" sx={{ 
          mb: 2,
          backgroundColor: 'rgba(211, 47, 47, 0.1)',
          color: '#ff8a80'
        }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
          required
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
          required
        />
        <Button 
          fullWidth 
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{ 
            mb: 2,
            height: 48,
            background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #6D28D9 30%, #DB2777 90%)',
            }
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Sign Up'
          )}
        </Button>
        <Button 
          fullWidth 
          variant="text"
          onClick={() => onToggleAuth('login')}
          disabled={loading}
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          Already have an account? Log in
        </Button>
      </Box>
    </Card>
  );
}