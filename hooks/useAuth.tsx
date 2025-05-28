import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string | null, password: string | null) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Here you would typically check for an existing session
    // For now, we'll just simulate a loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string | null, password: string | null) => {
    // Simulate authentication
    // Replace this with your actual authentication logic
    if (email === null && password === null) {
      // Guest mode
      setUser({ isGuest: true });
      return;
    }

    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ email });
  };

  const signUp = async (email: string, password: string) => {
    // Simulate registration
    // Replace this with your actual registration logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ email });
  };

  const signOut = async () => {
    // Simulate sign out
    // Replace this with your actual sign out logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}