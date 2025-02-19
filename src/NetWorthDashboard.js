import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Plus, Wallet, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, Button, Dialog, DialogContent, DialogTitle, TextField, Alert, Typography, Grid, Box, Container } from '@mui/material';

const NetWorthDashboard = () => {
  const [hasInitialData, setHasInitialData] = useState(false);
  const [networthData, setNetworthData] = useState(() => {
    const savedData = localStorage.getItem('networthData');
    return savedData ? JSON.parse(savedData) : [];
  });

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

  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#FFC107'];
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
      setHasInitialData(true);
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

    ASSETS.forEach(asset => {
      const value = parseFloat(formData[asset.key]) || 0;
      const previousValue = networthData.length > 0 ? networthData[networthData.length - 1][asset.key] : 0;
      newValues[asset.key] = value + previousValue;
      totalNetWorth += newValues[asset.key];
    });

    const newData = {
      month: hasInitialData ? 
        networthData[networthData.length - 1].month + 1 : 
        1,
      ...newValues,
      networth: totalNetWorth
    };

    const updatedNetworthData = [...networthData, newData];
    setNetworthData(updatedNetworthData);
    localStorage.setItem('networthData', JSON.stringify(updatedNetworthData));
    setHasInitialData(true);
    setFormData(Object.fromEntries(ASSETS.map(asset => [asset.key, ''])));
    setErrors({});
    setIsDialogOpen(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  };

  if (!hasInitialData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Track Your Wealth Journey
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Your personal net worth dashboard with comprehensive investment tracking
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#E3F2FD', borderRadius: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Box textAlign="center">
                  <Wallet className="w-12 h-12 text-blue-500" />
                  <Typography variant="h6" fontWeight="bold" mt={2}>
                    Track Assets
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Monitor all your investments in one place
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#E8F5E9', borderRadius: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Box textAlign="center">
                  <TrendingUp className="w-12 h-12 text-green-500" />
                  <Typography variant="h6" fontWeight="bold" mt={2}>
                    Visualize Growth
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    See your wealth grow over time
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#F3E5F5', borderRadius: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Box textAlign="center">
                  <DollarSign className="w-12 h-12 text-purple-500" />
                  <Typography variant="h6" fontWeight="bold" mt={2}>
                    Smart Insights
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Get insights about your portfolio
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box textAlign="center" mt={4}>
          <Button variant="contained" color="primary" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Start Tracking Your Net Worth
          </Button>
        </Box>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogContent>
            <DialogTitle>Enter Your Current Assets</DialogTitle>
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
                Start Tracking
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Net Worth Dashboard</Typography>
        <Button variant="contained" color="primary" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Data
        </Button>
      </Box>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
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
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary">Total Net Worth</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>{formatCurrency(networthData[networthData.length - 1].networth)}</Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {ASSETS.map(asset => (
                  <Grid item xs={4} key={asset.key}>
                    <Typography variant="body2" color="textSecondary">{asset.label}</Typography>
                    <Typography variant="h6">{formatCurrency(networthData[networthData.length - 1][asset.key])}</Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Net Worth Trend" />
            <CardContent>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={networthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="networth" stroke="#4CAF50" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Asset Distribution" />
            <CardContent>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getCurrentPieData()}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getCurrentPieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NetWorthDashboard;