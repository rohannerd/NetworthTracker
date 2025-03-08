import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  LinearProgress,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authModalStyles } from '../theme/authModalStyles.js';
import { TrendingUp, Savings, CurrencyBitcoin } from '@mui/icons-material';

const Onboarding = ({ onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    stocks: '',
    mutualFunds: '',
    fd: '',
    nps: '',
    savings: '',
    ppf: '',
    crypto: '',
  });
  const [showCelebration, setShowCelebration] = useState(false);

  const fields = [
    { name: 'stocks', label: 'Stocks', icon: <TrendingUp /> },
    { name: 'mutualFunds', label: 'Mutual Funds', icon: <TrendingUp /> },
    { name: 'fd', label: 'FD', icon: <Savings /> },
    { name: 'nps', label: 'NPS', icon: <Savings /> },
    { name: 'savings', label: 'Savings', icon: <Savings /> },
    { name: 'ppf', label: 'PPF', icon: <Savings /> },
    { name: 'crypto', label: 'Crypto', icon: <CurrencyBitcoin /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const handleNext = () => {
    if (step < fields.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    const newValues = {};
    let totalNetWorth = 0;

    Object.keys(formData).forEach((key) => {
      const value = parseFloat(formData[key]) || 0;
      newValues[key] = value;
      totalNetWorth += value;
    });

    const initialData = {
      date: new Date().toISOString(),
      ...newValues,
      networth: totalNetWorth,
    };

    localStorage.setItem('networthData', JSON.stringify([initialData]));
    setShowCelebration(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const celebrationVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      py: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              p: 4,
              background: 'linear-gradient(135deg, #2A3852, #1E293B)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
              '&:hover': {
                boxShadow: '0 28px 56px -12px rgba(0, 0, 0, 0.7)',
                transition: 'all 0.3s',
              },
            }}
          >
            <LinearProgress
              variant="determinate"
              value={((step + 1) / fields.length) * 100}
              sx={{
                mb: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                },
              }}
            />

            <Typography variant="h4" sx={{
              mb: 2,
              background: 'linear-gradient(to right, #fff, #a9c2ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              textAlign: 'center',
              fontSize: '2rem',
            }}>
              Let's set up your portfolio 🚀
            </Typography>

            <Typography sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 4,
              textAlign: 'center',
              fontSize: '1.1rem',
            }}>
              Step {step + 1} of {fields.length}
            </Typography>

            <Box sx={{ mb: 4 }}>
              <motion.div
                key={fields[step].name}
                initial="hidden"
                animate="visible"
                variants={fieldVariants}
              >
                <Tooltip title={`Enter the total value of your ${fields[step].label} investments`} placement="top">
                  <TextField
                    label={fields[step].label}
                    name={fields[step].name}
                    value={formData[fields[step].name]}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{
                      mb: 2,
                      ...authModalStyles.textField,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor:
                            formData[fields[step].name] && !isNaN(parseFloat(formData[fields[step].name]))
                              ? 'rgba(124, 58, 237, 0.5)'
                              : 'rgba(255, 255, 255, 0.3)',
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {fields[step].icon}
                          <Typography sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                            ₹
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    placeholder="0"
                    autoFocus
                  />
                </Tooltip>
              </motion.div>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {step > 0 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    height: 48,
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  height: 48,
                  background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #6D28D9 30%, #DB2777 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(124, 58, 237, 0.4)',
                  },
                  fontSize: '1rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: '120px',
                }}
              >
                {step < fields.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </Box>
          </Card>
        </motion.div>

        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={celebrationVariants}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
                  🎉 Great job!
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.2rem' }}>
                  Your portfolio is ready to track 🚀
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default Onboarding;