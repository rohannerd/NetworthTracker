// src/Components/UpdateForm.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Grid,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, Savings, CurrencyBitcoin } from '@mui/icons-material';

const UpdateForm = ({ initialData, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    stocks: initialData.stocks || '',
    mutualFunds: initialData.mutualFunds || '',
    fd: initialData.fd || '',
    nps: initialData.nps || '',
    savings: initialData.savings || '',
    ppf: initialData.ppf || '',
    crypto: initialData.crypto || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {};
    Object.keys(formData).forEach((key) => {
      const newValue = parseFloat(formData[key]) || 0;
      const oldValue = parseFloat(initialData[key]) || 0;
      updatedData[key] = newValue;
    });
    onUpdate(updatedData);
  };

  const fieldIcons = {
    stocks: <TrendingUp />,
    mutualFunds: <TrendingUp />,
    fd: <Savings />,
    nps: <Savings />,
    savings: <Savings />,
    ppf: <Savings />,
    crypto: <CurrencyBitcoin />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          p: { xs: 1, sm: 2, md: 4 }, // Reduced padding for mobile
          maxWidth: { xs: '90%', sm: '400px', md: '500px' }, // Full width on mobile, capped on larger screens
          width: '100%',
          background: 'linear-gradient(135deg, #2A3852, #1E293B)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: { xs: 1, sm: 2, md: 3 },
            background: 'linear-gradient(to right, #fff, #a9c2ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            textAlign: 'center',
            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
          }}
        >
          Update Your Portfolio
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            {Object.keys(formData).map((field) => (
              <Grid item xs={12} key={field}>
                <TextField
                  fullWidth
                  label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#7C3AED',
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#FFFFFF',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {fieldIcons[field]}
                        <Typography sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.8)', fontSize: { xs: '0.9rem', sm: '1rem' } }}>₹</Typography>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  type="number"
                />
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              mt: { xs: 1, sm: 2, md: 4 },
              display: 'flex',
              gap: { xs: 1, sm: 2 },
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, row on larger screens
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                py: { xs: 0.5, sm: 1 },
                px: { xs: 1.5, sm: 2.5 },
                textTransform: 'none',
                fontSize: { xs: '0.8rem', sm: '1rem' },
                fontWeight: 500,
                width: { xs: '100%', sm: 'auto' }, // Full width on mobile
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={{
                background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #6D28D9 30%, #DB2777 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                },
                py: { xs: 0.5, sm: 1 },
                px: { xs: 1.5, sm: 2.5 },
                textTransform: 'none',
                fontSize: { xs: '0.8rem', sm: '1rem' },
                fontWeight: 600,
                width: { xs: '100%', sm: 'auto' }, // Full width on mobile
              }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
};

export default UpdateForm;