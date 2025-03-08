// src/Components/Auth/Register.js
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../AuthContext';
import { authModalStyles } from '../../theme/authModalStyles.js';

export default function Register({ onToggleAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('handleSubmit triggered with form data:', { email, password, confirmPassword });

    if (password !== confirmPassword) {
      console.log('Password mismatch detected');
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      console.log('Password too short detected');
      return setError('Password should be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      console.log('Initiating signup with:', { email, password });
      const user = await signup(email, password);
      console.log('Signup completed for user:', user.uid);
      // Navigation is handled by AuthContext after signup
    } catch (error) {
      console.error('Registration error:', error.code, error.message);
      setError(
        error.code === 'auth/email-already-in-use'
          ? 'Email is already registered'
          : error.code === 'auth/invalid-email'
            ? 'Invalid email address'
            : error.code === 'auth/weak-password'
              ? 'Password is too weak'
              : 'Failed to register. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      sx={{
        p: 4,
        maxWidth: 400,
        width: '100%',
        background: 'linear-gradient(135deg, #1E293B, #2A3852)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Typography variant="h5" sx={{
        mb: 3,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
      }}>
        Create Your Account
      </Typography>
      {error && (
        <Alert severity="error" sx={{
          mb: 2,
          backgroundColor: 'rgba(211, 47, 47, 0.1)',
          color: '#ff8a80',
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
          sx={{ mb: 2, ...authModalStyles.textField }}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2, ...authModalStyles.textField }}
          required
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 3, ...authModalStyles.textField }}
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
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
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