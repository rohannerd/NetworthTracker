import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';

export default function AuthModal() {
  const { authModalOpen, authMode, closeAuthModal, login, signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await signup(email, password);
      } else {
        await login(email, password);
      }
      closeAuthModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={authModalOpen}
      onClose={closeAuthModal}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(15, 23, 42, 0.98)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'visible'
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ p: 4, position: 'relative' }}>
            <IconButton
              onClick={closeAuthModal}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: 'rgba(255, 255, 255, 0.5)',
                '&:hover': { color: 'white' }
              }}
            >
              <X size={20} />
            </IconButton>

            <Typography variant="h5" sx={{
              mb: 1,
              fontWeight: 700,
              background: 'linear-gradient(to right, #fff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {authMode === 'login' ? 'Welcome back' : 'Create your account'}
            </Typography>

            <Typography sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.6)' }}>
              {authMode === 'login'
                ? 'Sign in to access your dashboard'
                : 'Start tracking your wealth journey'}
            </Typography>

            {error && (
              <Alert severity="error" sx={{
                mb: 3,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444'
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
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: authMode === 'signup' ? 2 : 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {authMode === 'signup' && (
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={{ mb: 3 }}
                />
              )}

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  height: 48,
                  background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #6D28D9 30%, #DB2777 90%)'
                  }
                }}
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </Box>
          </Box>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}