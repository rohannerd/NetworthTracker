import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './Firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  async function signup(email, password) {
    console.log('signup function called with:', { email, password }); // Debug
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created in Authentication:', user.uid); // Debug

      try {
        const userDoc = doc(db, 'users', user.uid);
        const data = { email, createdAt: new Date().toISOString() };
        console.log('Attempting to write to Firestore:', { path: userDoc.path, data }); // Debug
        await setDoc(userDoc, data);
        console.log('Firestore write succeeded for user:', user.uid); // Debug
      } catch (firestoreError) {
        console.error('Firestore write failed:', firestoreError.code, firestoreError.message);
      }

      return user;
    } catch (authError) {
      console.error('Authentication error:', authError.code, authError.message);
      throw authError;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigate('/dashboard');
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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