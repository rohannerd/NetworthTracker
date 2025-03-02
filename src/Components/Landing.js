import React, { useState } from 'react';
import { 
  AppBar,
  Box, 
  Container, 
  Typography, 
  Button, 
  Dialog,
  Toolbar,
  DialogContent,
  IconButton,
  Link
} from '@mui/material';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { useAuth } from '../Components/AuthContext'; // Updated import path

export default function Landing() {
  const { openAuthModal } = useAuth();

  const navLinks = ['Features', 'Pricing', 'About', 'Resources'];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#030711' // Darker background for better contrast
    }}>
      {/* Modern Navbar with Links */}
      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{ 
          background: 'rgba(5, 14, 29, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 700,
            letterSpacing: '-0.5px'
          }}>
            WealthTrack
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: 4,
            alignItems: 'center',
            mr: 4
          }}>
            {navLinks.map((link) => (
              <Link
                key={link}
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  '&:hover': {
                    color: 'white'
                  }
                }}
              >
                {link}
              </Link>
            ))}
          </Box>
          
          {/* Auth Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined"
              onClick={() => openAuthModal('login')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                py: 1,
                px: 2.5,
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              Log in
            </Button>
            <Button 
              variant="contained"
              onClick={() => openAuthModal('signup')}
              sx={{
                bgcolor: '#4d7eff',
                py: 1,
                px: 2.5,
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: '#3a6efd',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(77, 126, 255, 0.3)'
                }
              }}
            >
              Sign up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Gradient */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(77, 126, 255, 0.15), transparent 70%)',
          zIndex: 0
        }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ 
            textAlign: 'center',
            maxWidth: '800px',
            mx: 'auto',
            px: { xs: 2, md: 0 }
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="h1" sx={{
                fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                fontWeight: 700,
                letterSpacing: '-1.5px',
                lineHeight: 1.1,
                mb: 3,
                background: 'linear-gradient(to right, #fff, #a9c2ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Track Your Wealth Journey With Precision
              </Typography>

              <Typography sx={{ 
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 6,
                lineHeight: 1.6
              }}>
                Your personal net worth dashboard with comprehensive investment tracking, 
                automated analytics, and insights to optimize your financial future.
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center'
              }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => openAuthModal('signup')}
                  sx={{
                    background: 'linear-gradient(90deg, #4d7eff 0%, #6c5ce7 100%)',
                    fontSize: '1rem',
                    py: 1.5,
                    px: 4,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #3a6efd 0%, #5b4ed1 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(77, 126, 255, 0.3)'
                    }
                  }}
                >
                  Get Started — It's Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    fontSize: '1rem',
                    py: 1.5,
                    px: 4,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  Watch Demo
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}