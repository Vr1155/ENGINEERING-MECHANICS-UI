import React from 'react';
import { AuthContext, useAuthProvider } from '../../hooks/useAuth';

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {auth.loading ? null : children}
    </AuthContext.Provider>
  );
}