import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User as FirebaseUser } from 'firebase/auth';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'sales_manager' | 'salesperson' | 'customer';
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    avatar?: string;
    territory?: string;
    permissions: string[];
    customerId?: string;
  };
  settings: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    preferences: {
      theme: 'light' | 'dark';
      language: string;
      currency: string;
    };
  };
  status: 'active' | 'inactive' | 'suspended';
}

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasPermission: (permission: string) => boolean;
  isRole: (role: string | string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      firebaseUser: null,
      loading: true,
      error: null,
      initialized: false,

      setUser: (user) => set({ user }),
      setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setInitialized: (initialized) => set({ initialized }),
      
      logout: () => set({ 
        user: null, 
        firebaseUser: null, 
        loading: false,
        error: null 
      }),

      isAuthenticated: () => {
        const { user, firebaseUser } = get();
        return !!(user && firebaseUser);
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        return user?.profile.permissions?.includes(permission) || false;
      },

      isRole: (role: string | string[]) => {
        const { user } = get();
        if (!user) return false;
        
        if (Array.isArray(role)) {
          return role.includes(user.role);
        }
        
        return user.role === role;
      },
    }),
    {
      name: 'meat-market-auth',
      partialize: (state) => ({ 
        user: state.user,
        initialized: state.initialized 
      }),
    }
  )
);
