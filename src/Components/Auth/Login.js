// src/Components/Auth/Login.js
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
  Alert,
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { authModalStyles } from '../../theme/authModalStyles.js';

export default function Login({ isOpen, onClose, onToggleAuth }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      onClose(); // Close modal after successful login (navigation handled by AuthContext)
    } catch (error) {
      setError('Invalid email or password');
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
          },
        },
      }}
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #1E293B, #2A3852)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.8)',
          p: 3,
        },
      }}
    >
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ position: 'relative', mb: 4 }}>
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: -8,
                top: -8,
                color: 'rgba(255, 255, 255, 0.5)',
                '&:hover': { color: 'white' },
              }}
            >
              <X size={20} />
            </IconButton>

            <Typography variant="h5" sx={{
              fontWeight: 700,
              background: 'linear-gradient(to right, #fff, #a9c2ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}>
              Welcome back
            </Typography>

            <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Sign in to access your dashboard
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2, ...authModalStyles.textField }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: 1.5 }}>
                    <Mail size={20} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3, ...authModalStyles.textField }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: 1.5 }}>
                    <Lock size={20} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        mr: 0.5,
                        '&:hover': { color: 'white' },
                      }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                height: 48,
                background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                mb: 2,
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #6D28D9 30%, #DB2777 90%)',
                  boxShadow: '0 6px 16px rgba(124, 58, 237, 0.4)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => onToggleAuth('register')}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'none',
                '&:hover': { color: 'white' },
              }}
            >
              Don't have an account? Sign up
            </Button>
          </Box>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}