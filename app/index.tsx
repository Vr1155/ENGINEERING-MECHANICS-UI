import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { user } = useAuth();

  useEffect(() => {
    // This ensures the auth state is loaded before redirecting
    if (user !== undefined) {
      return;
    }
  }, [user]);

  // If auth state is not loaded yet, return null
  if (user === undefined) {
    return null;
  }

  // If user is logged in, redirect to tabs, otherwise to login
  return <Redirect href={user ? '/(tabs)/learning' : '/(auth)/login'} />;
}