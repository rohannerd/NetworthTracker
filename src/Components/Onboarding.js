import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
} from '@mui/material';
import { motion } from 'framer-motion';

const Onboarding = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    stocks: '',
    mutualFunds: '',
    fd: '',
    nps: '',
    savings: '',
    ppf: '',
    crypto: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const handleSubmit = () => {
    const newValues = {};
    let totalNetWorth = 0;

    Object.keys(formData).forEach(key => {
      const value = parseFloat(formData[key]) || 0;
      newValues[key] = value;
      totalNetWorth += value;
    });

    const initialData = {
      date: new Date().toISOString(),
      ...newValues,
      networth: totalNetWorth
    };

    onComplete(initialData);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #312E81 100%)',
      py: 8
    }}>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Typography variant="h4" sx={{
              mb: 3,
              background: 'linear-gradient(to right, #fff, #a9c2ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700
            }}>
              Let's set up your portfolio 🚀
            </Typography>

            <Typography sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 4
            }}>
              Enter your current investment values to get started
            </Typography>

            {Object.keys(formData).map((field) => (
              <TextField
                key={field}
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: '₹',
                }}
              />
            ))}

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmit}
              sx={{
                mt: 3,
                height: 48,
                background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)'
              }}
            >
              Complete Setup
            </Button>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Onboarding;