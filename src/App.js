import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './Components/AuthContext';
import Landing from './Components/Landing';
import Onboarding from './Components/Onboarding';
import NetWorthDashboard from './NetWorthDashboard';
import AuthModal from './Components/Auth/AuthModal';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E293B',
          color: '#FFFFFF'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-input': {
            color: '#FFFFFF'
          }
        }
      }
    }
  }
});

const AuthWrapper = () => {
  const { user } = useAuth();
  const [hasInitialData, setHasInitialData] = useState(() => {
    const savedData = localStorage.getItem('networthData');
    return savedData ? JSON.parse(savedData).length > 0 : false;
  });

  const handleOnboardingComplete = (initialData) => {
    localStorage.setItem('networthData', JSON.stringify([initialData]));
    setHasInitialData(true);
  };

  if (!user) {
    return <Landing />;
  }

  if (!hasInitialData) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return <NetWorthDashboard />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<NetWorthDashboard />} />
          </Routes>
          <AuthModal />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;