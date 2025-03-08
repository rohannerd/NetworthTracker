// src/Components/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from './Firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();

  // Check if user has existing networth data
  const checkExistingData = async (uid) => {
    try {
      const networthCollectionRef = collection(db, `users/${uid}/networthData`);
      const q = query(networthCollectionRef);
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty; // Returns true if data exists
    } catch (err) {
      console.error('Error checking existing data:', err);
      return false; // Default to false on error
    }
  };

  // Handle signup
  async function signup(email, password) {
    console.log('signup function called with:', { email, password });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created in Authentication:', user.uid);

      try {
        const userDoc = doc(db, 'users', user.uid);
        const data = { email, createdAt: new Date().toISOString() };
        console.log('Attempting to write to Firestore:', { path: userDoc.path, data });
        await setDoc(userDoc, data);
        console.log('Firestore write succeeded for user:', user.uid);
      } catch (firestoreError) {
        console.error('Firestore write failed:', firestoreError.code, firestoreError.message);
      }

      // Check for existing data and navigate
      const hasData = await checkExistingData(user.uid);
      navigate(hasData ? '/dashboard' : '/onboarding');
      return user;
    } catch (authError) {
      console.error('Authentication error:', authError.code, authError.message);
      throw authError;
    }
  }

  // Handle login
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser(user);

      // Check for existing data and navigate
      const hasData = await checkExistingData(user.uid);
      navigate(hasData ? '/dashboard' : '/onboarding');
      closeAuthModal();
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  }

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const hasData = await checkExistingData(user.uid);
        navigate(hasData ? '/dashboard' : '/onboarding');
      } else {
        setUser(null);
        navigate('/');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const value = {
    user,
    signup,
    login,
    logout,
    loading,
    authModalOpen,
    authMode,
    openAuthModal,
    closeAuthModal
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};