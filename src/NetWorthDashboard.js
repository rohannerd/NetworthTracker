import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Modal,
  TextField, // Added TextField import
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Components/AuthContext';
import UpdateForm from './Components/UpdateForm';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const NetWorthDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [networthData, setNetworthData] = useState([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [goal, setGoal] = useState(() => {
    const savedGoal = localStorage.getItem('networthGoal');
    return savedGoal ? parseFloat(savedGoal) : 0;
  });

  useEffect(() => {
    const savedData = localStorage.getItem('networthData');
    if (savedData) {
      setNetworthData(JSON.parse(savedData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAddNewData = () => {
    setOpenUpdateModal(true);
  };

  const handleUpdateComplete = (updatedData) => {
    const newEntry = {
      date: new Date().toISOString(),
      ...updatedData,
      networth: Object.values(updatedData).reduce((sum, value) => sum + (parseFloat(value) || 0), 0),
    };
    const updatedNetworthData = [...networthData, newEntry];
    localStorage.setItem('networthData', JSON.stringify(updatedNetworthData));
    setNetworthData(updatedNetworthData);
    setOpenUpdateModal(false);
  };

  const handleSetGoal = (e) => {
    e.preventDefault();
    const goalValue = parseFloat(e.target.goal.value) || 0;
    if (goalValue > 0) {
      setGoal(goalValue);
      localStorage.setItem('networthGoal', goalValue);
    }
    setOpenGoalModal(false);
  };

  const latestData = networthData[networthData.length - 1] || {};
  const totalNetWorth = latestData.networth || 0;
  const progress = goal > 0 ? (totalNetWorth / goal) * 100 : 0;
  const remaining = goal > 0 ? goal - totalNetWorth : 0;

  const assetData = [
    { name: 'Stocks', value: latestData.stocks || 0 },
    { name: 'Mutual Funds', value: latestData.mutualFunds || 0 },
    { name: 'Fixed Deposits', value: latestData.fd || 0 },
    { name: 'NPS', value: latestData.nps || 0 },
    { name: 'Savings', value: latestData.savings || 0 },
    { name: 'PPF', value: latestData.ppf || 0 },
    { name: 'Crypto', value: latestData.crypto || 0 },
  ];

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'];

  const chartData = networthData.map((entry, index) => ({
    date: `Day ${index + 1}`,
    networth: entry.networth,
  }));

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      py: 8,
    }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'rgba(5, 14, 29, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>
          <Typography variant="h6" sx={{
            fontWeight: 700,
            letterSpacing: '-0.5px',
          }}>
            WealthTrack
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleAddNewData}
              sx={{
                background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                py: 1,
                px: 2.5,
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                '&:hover': {
                  background: 'linear-gradient(45deg, #6D28D9 30%, #DB2777 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                },
              }}
            >
              Add New Data
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpenGoalModal(true)}
              sx={{
                background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                py: 1,
                px: 2.5,
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                },
              }}
            >
              Set Goal
            </Button>
            <Button
              variant="outlined"
              onClick={handleLogout}
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
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Typography variant="h4" sx={{
          mb: 4,
          background: 'linear-gradient(to right, #fff, #a9c2ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          textAlign: 'center',
          fontSize: '2.5rem',
        }}>
          Net Worth Dashboard
        </Typography>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.5rem',
              fontWeight: 500,
            }}>
              Total Net Worth
            </Typography>
            <Typography sx={{
              color: '#FFFFFF',
              fontSize: '3rem',
              fontWeight: 700,
            }}>
              ₹{totalNetWorth.toLocaleString()}
            </Typography>
            {goal > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  height: '20px',
                  background: 'linear-gradient(90deg, #7C3AED 0%, #EC4899 100%)',
                  borderRadius: '10px',
                  marginTop: '1rem',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    background: '#2A3852',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {progress.toFixed(1)}% (₹{remaining.toLocaleString()} left)
                  </Typography>
                </Box>
              </motion.div>
            )}
          </Box>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            {assetData.map((asset, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={asset.name}>
                <motion.div
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #1E293B, #2A3852)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5)',
                        transition: 'all 0.3s',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        mb: 1,
                      }}>
                        {asset.name}
                      </Typography>
                      <Typography sx={{
                        color: '#FFFFFF',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                      }}>
                        ₹{asset.value.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #1E293B, #2A3852)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    p: 3,
                  }}
                >
                  <Typography sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    mb: 2,
                  }}>
                    Net Worth Trend
                  </Typography>
                  <LineChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis
                      dataKey="date"
                      stroke="rgba(255, 255, 255, 0.5)"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      stroke="rgba(255, 255, 255, 0.5)"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#2A3852',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                      }}
                      itemStyle={{ color: '#FFFFFF' }}
                    />
                    <Legend wrapperStyle={{ color: '#FFFFFF' }} />
                    <Line
                      type="monotone"
                      dataKey="networth"
                      stroke="url(#netWorthGradient)"
                      strokeWidth={2}
                      dot={{ fill: '#7C3AED', stroke: '#FFFFFF', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    >
                      <defs>
                        <linearGradient id="netWorthGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#7C3AED" />
                          <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                      </defs>
                    </Line>
                  </LineChart>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #1E293B, #2A3852)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    p: 3,
                  }}
                >
                  <Typography sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    mb: 2,
                  }}>
                    Asset Distribution
                  </Typography>
                  <PieChart width={500} height={300}>
                    <Pie
                      data={assetData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) =>
                        percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : null
                      }
                      labelStyle={{ fill: '#FFFFFF', fontSize: 12 }}
                    >
                      {assetData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#2A3852',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                      }}
                      itemStyle={{ color: '#FFFFFF' }}
                    />
                  </PieChart>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      <Modal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UpdateForm
          initialData={latestData}
          onUpdate={handleUpdateComplete}
          onClose={() => setOpenUpdateModal(false)}
        />
      </Modal>

      <Modal
        open={openGoalModal}
        onClose={() => setOpenGoalModal(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          sx={{
            p: 4,
            maxWidth: 400,
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
            Set Net Worth Goal
          </Typography>
          <Box component="form" onSubmit={handleSetGoal}>
            <TextField
              fullWidth
              name="goal"
              label="Target Net Worth (₹)"
              type="number"
              defaultValue={goal || ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                  '&.Mui-focused fieldset': { borderColor: '#4CAF50', borderWidth: '2px' },
                },
                '& .MuiOutlinedInput-input': { color: '#FFFFFF' },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.9)' },
                mb: 3,
              }}
              InputProps={{
                startAdornment: <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mr: 1 }}>₹</Typography>,
              }}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => setOpenGoalModal(false)}
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
                  background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  },
                  py: 1,
                  px: 2.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Set Goal
              </Button>
            </Box>
          </Box>
        </Card>
      </Modal>
    </Box>
  );
};

export default NetWorthDashboard;