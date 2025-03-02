import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'; // Remove unused icons
import { Card, CardContent, CardHeader, Button, Dialog, DialogContent, DialogTitle, TextField, Alert, Typography, Grid, Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { useAuth } from './Components/AuthContext';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7C3AED',
      light: '#9F67FF',
      dark: '#5B21B6',
    },
    secondary: {
      main: '#EC4899',
      light: '#F472B6',
      dark: '#BE185D',
    },
    background: {
      default: '#030711', // Darker background like landing page
      paper: '#2A3852',   // Match login modal background
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#2A3852',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.8)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
          fontSize: '0.95rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #6D28D9 30%, #DB2777 90%)',
            boxShadow: '0 6px 16px rgba(124, 58, 237, 0.4)',
            transform: 'translateY(-1px)'
          }
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)'
          }
        }
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            height: '48px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            '& fieldset': {
              border: 'none'
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '2px solid #7C3AED'
            }
          },
          '& .MuiOutlinedInput-input': {
            color: '#fff',
            '&::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
              opacity: 1
            }
          }
        }
      }
    }
  }
});

const NetWorthDashboard = () => {
  const { logout } = useAuth(); // Remove user if not being used
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Initialize hasInitialData from localStorage
  const [hasInitialData, setHasInitialData] = useState(() => {
    const savedData = localStorage.getItem('networthData');
    return savedData ? JSON.parse(savedData).length > 0 : false;
  });

  // Initialize networthData from localStorage
  const [networthData, setNetworthData] = useState(() => {
    const savedData = localStorage.getItem('networthData');
    return savedData ? JSON.parse(savedData) : [];
  });

  // Initialize other state variables
  const [formData, setFormData] = useState({
    stocks: '',
    mutualFunds: '',
    fd: '',
    nps: '',
    savings: '',
    ppf: '',
    crypto: ''
  });

  const [errors, setErrors] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const COLORS = [
    '#4F46E5', // Indigo for Stocks
    '#7C3AED', // Purple for Mutual Funds
    '#EC4899', // Pink for FD
    '#06B6D4', // Cyan for NPS
    '#10B981', // Emerald for Savings
    '#F59E0B', // Amber for PPF
    '#6366F1'  // Indigo for Crypto
  ];
  const ASSETS = [
    { key: 'stocks', label: 'Stocks' },
    { key: 'mutualFunds', label: 'Mutual Funds' },
    { key: 'fd', label: 'Fixed Deposits' },
    { key: 'nps', label: 'NPS' },
    { key: 'savings', label: 'Savings' },
    { key: 'ppf', label: 'PPF' },
    { key: 'crypto', label: 'Crypto' }
  ];

  useEffect(() => {
    if (networthData.length > 0) {
      localStorage.setItem('networthData', JSON.stringify(networthData));
    }
  }, [networthData]);

  const validateInput = (value, field) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    
    if (sanitizedValue === '') return '';
    
    const numValue = parseFloat(sanitizedValue);
    
    if (isNaN(numValue)) {
      setErrors(prev => ({ ...prev, [field]: 'Please enter a valid number' }));
      return '';
    }
    
    if (numValue < 0) {
      setErrors(prev => ({ ...prev, [field]: 'Value cannot be negative' }));
      return '';
    }
    
    return sanitizedValue;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validatedValue = validateInput(value, name);
    setFormData(prev => ({
      ...prev,
      [name]: validatedValue
    }));
  };

  const getCurrentPieData = () => {
    if (!hasInitialData) return [];
    const latest = networthData[networthData.length - 1];
    return ASSETS.map(asset => ({
      name: asset.label,
      value: latest[asset.key]
    }));
  };

  const handleSubmit = () => {
    if (Object.values(errors).some(error => error !== '')) {
      setErrors(prev => ({
        ...prev,
        form: 'Please correct all errors before submitting'
      }));
      return;
    }

    const newValues = {};
    let totalNetWorth = 0;

    // Get the previous entry if it exists
    const previousEntry = networthData.length > 0 ? networthData[networthData.length - 1] : null;

    ASSETS.forEach(asset => {
      // Only update values that were entered, keep previous values for others
      const enteredValue = parseFloat(formData[asset.key]) || 0;
      const previousValue = previousEntry ? previousEntry[asset.key] : 0;
      
      // Use entered value if provided, otherwise keep previous value
      newValues[asset.key] = formData[asset.key] !== '' ? enteredValue : previousValue;
      totalNetWorth += newValues[asset.key];
    });

    const newData = {
      date: new Date().toISOString(),
      ...newValues,
      networth: totalNetWorth
    };

    const updatedNetworthData = [...networthData, newData];
    setNetworthData(updatedNetworthData);
    setHasInitialData(true);
    setFormData(Object.fromEntries(ASSETS.map(asset => [asset.key, ''])));
    setErrors({});
    setIsDialogOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) { // 1 crore or more
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) { // 1 lakh or more
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

// Add this after your existing utility functions
const calculatePercentageChange = (currentValue, previousValue) => {
  if (!previousValue) return null;
  return ((currentValue - previousValue) / previousValue) * 100;
};

// Update the dashboard container styles
return (
  <ThemeProvider theme={theme}>
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #030711 0%, #1E293B 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.1), transparent 70%)',
        pointerEvents: 'none'
      }
    }}>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Update header styling */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: { xs: 4, md: 5 },
          gap: 3
        }}>
          <Typography 
            variant="h4" 
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              background: 'linear-gradient(to right, #fff, #a9c2ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: { xs: 2, sm: 0 }
            }}
          >
            Net Worth Dashboard
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Button
              variant="contained"
              onClick={() => setIsDialogOpen(true)}
              startIcon={<Plus />}
              sx={{
                height: '48px',
                px: 3
              }}
            >
              Add New Data
            </Button>
            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{
                height: '48px',
                px: 3
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Update Grid spacing and card styling */}
        <Grid container spacing={3}>
          {/* Total Net Worth Card */}
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" color="text.secondary">Total Net Worth</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(networthData[networthData.length - 1].networth)}
                </Typography>
                {networthData.length > 1 && (
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: (theme) => alpha(
                        networthData[networthData.length - 1].networth > networthData[networthData.length - 2].networth 
                          ? '#10B981' 
                          : '#EF4444',
                        0.1
                      ),
                    }}
                  >
                    {networthData[networthData.length - 1].networth > networthData[networthData.length - 2].networth ? (
                      <TrendingUp size={20} style={{ color: '#10B981' }} />
                    ) : (
                      <TrendingDown size={20} style={{ color: '#EF4444' }} />
                    )}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: networthData[networthData.length - 1].networth > networthData[networthData.length - 2].networth 
                          ? '#10B981' 
                          : '#EF4444'
                      }}
                    >
                      {Math.abs(calculatePercentageChange(
                        networthData[networthData.length - 1].networth,
                        networthData[networthData.length - 2].networth
                      )).toFixed(1)}%
                    </Typography>
                  </Box>
                )}
              </Box>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {ASSETS.map(asset => (
                  <Grid item xs={12} sm={6} md={3} key={asset.key}>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
                      <Typography variant="body2" color="text.secondary">{asset.label}</Typography>
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        {formatCurrency(networthData[networthData.length - 1][asset.key])}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>

          {/* Charts Grid */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '450px' }}>
              <CardHeader 
                title="Net Worth Trend" 
                sx={{ 
                  pb: 0,
                  '& .MuiCardHeader-title': {
                    fontSize: '1.25rem',
                    fontWeight: 600
                  }
                }}
              />
              <CardContent sx={{ height: 'calc(100% - 72px)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={networthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" // Changed from "month" to "date"
                      stroke="rgba(255,255,255,0.5)"
                      tickFormatter={formatDate}
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tickFormatter={formatCurrency}
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                      width={100}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [formatCurrency(value), "Net Worth"]}
                      labelFormatter={formatDate}
                    />
                    <Line
                      type="monotone"
                      dataKey="networth"
                      stroke="url(#colorGradient)"
                      strokeWidth={2}
                      dot={{ fill: '#7C3AED', strokeWidth: 2 }}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '450px' }}>
              <CardHeader 
                title="Asset Distribution" 
                sx={{ 
                  pb: 0,
                  '& .MuiCardHeader-title': {
                    fontSize: '1.25rem',
                    fontWeight: 600
                  }
                }}
              />
              <CardContent sx={{ height: 'calc(100% - 72px)' }}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flex: '1 1 60%', minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getCurrentPieData()}
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={3}
                          dataKey="value"
                          label={({
                            cx,
                            cy,
                            midAngle,
                            innerRadius,
                            outerRadius,
                            percent,
                            value
                          }) => {
                            const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
                            const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                            const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                            return percent > 0.05 ? (
                              <text
                                x={x}
                                y={y}
                                fill="white"
                                textAnchor={x > cx ? 'start' : 'end'}
                                dominantBaseline="central"
                                fontSize="14"
                                fontWeight="500"
                              >
                                {`${(percent * 100).toFixed(0)}%`}
                              </text>
                            ) : null;
                          }}
                        >
                          {getCurrentPieData().map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]}
                              strokeWidth={0}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box sx={{ 
                    flex: '1 1 40%',
                    overflowY: 'auto',
                    mt: 2
                  }}>
                    {/* Updated legend layout */}
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: 2,
                      mt: 3
                    }}>
                      {getCurrentPieData().map((entry, index) => {
                        const percentage = (entry.value / networthData[networthData.length - 1].networth * 100).toFixed(1);
                        return (
                          <Box
                            key={`legend-${index}`}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              transition: 'all 0.2s',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                backgroundColor: COLORS[index % COLORS.length],
                                borderRadius: '50%',
                                flexShrink: 0
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" sx={{ 
                                color: 'text.primary',
                                fontWeight: 600,
                                mb: 0.5
                              }}>
                                {entry.name}
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                {formatCurrency(entry.value)}
                                <span style={{ 
                                  color: COLORS[index % COLORS.length],
                                  fontWeight: 600 
                                }}>
                                  {percentage}%
                                </span>
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Update Dialog for mobile */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              backgroundColor: '#2A3852',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.8)',
              p: 3
            }
          }}
        >
          <DialogContent>
            <DialogTitle>Add New Investments</DialogTitle>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
              {ASSETS.map(asset => (
                <TextField
                  key={asset.key}
                  id={asset.key}
                  name={asset.key}
                  label={asset.label}
                  type="text"
                  value={formData[asset.key]}
                  onChange={handleInputChange}
                  placeholder={`Enter ${asset.label} value`}
                  error={!!errors[asset.key]}
                  helperText={errors[asset.key]}
                  fullWidth
                  margin="normal"
                />
              ))}
              {errors.form && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errors.form}
                </Alert>
              )}
              <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
                Update
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  </ThemeProvider>
);
};

export default NetWorthDashboard;