'use client';

import { useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { 
    setUser, 
    setFirebaseUser, 
    setLoading, 
    setError, 
    setInitialized,
    initialized 
  } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        setError(null);
        
        if (firebaseUser) {
          // User is signed in
          setFirebaseUser(firebaseUser);
          
          // Fetch user profile from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              role: userData.role,
              profile: userData.profile,
              settings: userData.settings || {
                notifications: {
                  email: true,
                  sms: true,
                  push: true
                },
                preferences: {
                  theme: 'light',
                  language: 'en',
                  currency: 'ZAR'
                }
              },
              status: userData.status || 'active'
            });
          } else {
            // User document doesn't exist, create one with default values
            const defaultUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              role: 'salesperson' as const,
              profile: {
                firstName: firebaseUser.displayName?.split(' ')[0] || '',
                lastName: firebaseUser.displayName?.split(' ')[1] || '',
                phone: firebaseUser.phoneNumber || '',
                permissions: []
              },
              settings: {
                notifications: {
                  email: true,
                  sms: true,
                  push: true
                },
                preferences: {
                  theme: 'light' as const,
                  language: 'en',
                  currency: 'ZAR'
                }
              },
              status: 'active' as const
            };
            setUser(defaultUser);
            console.log('User document not found, using default profile');
          }
        } else {
          // User is signed out
          setUser(null);
          setFirebaseUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError(error instanceof Error ? error.message : 'Authentication error');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [setUser, setFirebaseUser, setLoading, setError, setInitialized]);

  // Show loading spinner while auth is initializing
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
