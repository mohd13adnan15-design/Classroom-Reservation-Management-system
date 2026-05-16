import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  role: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  demoLogin: (email: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: false,
  logout: async () => {},
  demoLogin: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Set to false for instant demo

  // --- DEMO OVERRIDE FUNCTIONS ---
  // These allow you to preview all portals without setting up Supabase accounts yet
  const demoLogin = (email: string) => {
    let newRole = 'student';
    if (email.includes('faculty')) newRole = 'faculty';
    if (email.includes('hod')) newRole = 'hod';
    if (email.includes('admin')) newRole = 'super_admin';
    
    setUser({ id: 'dummy_id', email } as User);
    setRole(newRole);
  };

  const logout = async () => {
    // Clear demo state
    setUser(null);
    setRole(null);
    // Also try to sign out from actual supabase just in case
    await supabase.auth.signOut().catch(() => {});
  };

  const contextValue = {
    user,
    role,
    loading,
    logout,
    demoLogin
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
