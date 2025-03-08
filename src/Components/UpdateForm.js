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
          p: 4,
          maxWidth: 500,
          width: '100%',
          background: 'linear-gradient(135deg, #2A3852, #1E293B)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Typography variant="h5" sx={{
          mb: 3,
          background: 'linear-gradient(to right, #fff, #a9c2ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          textAlign: 'center',
        }}>
          Update Your Portfolio
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {Object.keys(formData).map((field) => (
              <Grid item xs={12} sm={6} key={field}>
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
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {fieldIcons[field]}
                        <Typography sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.8)' }}>₹</Typography>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  type="number"
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                py: 1,
                px: 2.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
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
                py: 1,
                px: 2.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
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