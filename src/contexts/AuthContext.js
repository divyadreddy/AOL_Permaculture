import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { fetchUserProfile as r2FetchUserProfile, saveUserProfile as r2SaveUserProfile } from '../cloudflare-r2';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Load or create profile in R2
        let profile = await r2FetchUserProfile(user.uid);
        if (!profile) {
          profile = { id: user.uid, email: user.email, user_type: 'buyer', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
          await r2SaveUserProfile(user.uid, profile);
        }
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (email, password, userType, profileData) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (profileData?.display_name) {
        await updateProfile(cred.user, { displayName: profileData.display_name });
      }
      const profile = { id: cred.user.uid, email, user_type: userType, ...profileData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      await r2SaveUserProfile(cred.user.uid, profile);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = async (uid, updates) => {
    try {
      const existing = await r2FetchUserProfile(uid);
      const merged = { ...existing, ...updates, updated_at: new Date().toISOString() };
      await r2SaveUserProfile(uid, merged);
      setUserProfile(merged);
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = { currentUser, userProfile, signup, login, logout, updateUserProfile, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
