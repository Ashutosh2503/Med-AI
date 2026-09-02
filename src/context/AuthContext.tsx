import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, LanguageCode } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isRealSupabase: boolean;
  signUp: (email: string, password: string, name: string, preferredLanguage?: LanguageCode) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'medai_auth_user';
const LOCAL_STORAGE_USERS_DB_KEY = 'medai_registered_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session on mount
  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile);
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                preferred_language: 'en',
                created_at: new Date().toISOString(),
              });
            }
          }

          // Listen to Supabase auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (profile) {
                setUser(profile);
              } else {
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                  preferred_language: 'en',
                  created_at: new Date().toISOString(),
                });
              }
            } else {
              setUser(null);
            }
          });

          return () => {
            subscription.unsubscribe();
          };
        } else {
          // Local sandbox fallback for preview resilience
          const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            }
          }
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const clearError = () => setError(null);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    preferredLanguage: LanguageCode = 'en'
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return false;
    }
    if (!name.trim()) {
      setError('Please provide your full name or campus display name.');
      setIsLoading(false);
      return false;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: sbError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, preferred_language: preferredLanguage },
          },
        });

        if (sbError) {
          setError(sbError.message);
          setIsLoading(false);
          return false;
        }

        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            name,
            email,
            preferred_language: preferredLanguage,
            created_at: new Date().toISOString(),
          };

          // Try to insert profile to Supabase
          await supabase.from('profiles').upsert(profile);
          setUser(profile);
          setIsLoading(false);
          return true;
        }
      } else {
        // Local Sandbox simulation
        const existingUsersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_DB_KEY);
        const users: Array<{ email: string; passwordHash: string; profile: UserProfile }> = existingUsersRaw
          ? JSON.parse(existingUsersRaw)
          : [];

        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          setError('An account with this email address already exists. Please sign in.');
          setIsLoading(false);
          return false;
        }

        const newProfile: UserProfile = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          preferred_language: preferredLanguage,
          created_at: new Date().toISOString(),
        };

        users.push({
          email: email.trim().toLowerCase(),
          passwordHash: btoa(password), // Simulated safe hash for demo
          profile: newProfile,
        });

        localStorage.setItem(LOCAL_STORAGE_USERS_DB_KEY, JSON.stringify(users));
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));
        setUser(newProfile);
        setIsLoading(false);
        return true;
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
      setIsLoading(false);
      return false;
    }

    setIsLoading(false);
    return false;
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Please enter both your email and password.');
      setIsLoading(false);
      return false;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: sbError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (sbError) {
          setError(sbError.message);
          setIsLoading(false);
          return false;
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const activeProfile: UserProfile = profile || {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || email.split('@')[0],
            preferred_language: 'en',
            created_at: new Date().toISOString(),
          };

          setUser(activeProfile);
          setIsLoading(false);
          return true;
        }
      } else {
        // Local Sandbox simulation
        const existingUsersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_DB_KEY);
        const users: Array<{ email: string; passwordHash: string; profile: UserProfile }> = existingUsersRaw
          ? JSON.parse(existingUsersRaw)
          : [];

        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.passwordHash === btoa(password)
        );

        if (!found) {
          // Allow a quick demo user login if no users exist
          if (users.length === 0 && email.includes('@') && password.length >= 6) {
            const demoProfile: UserProfile = {
              id: 'usr_demo_123',
              name: email.split('@')[0],
              email: email.toLowerCase().trim(),
              preferred_language: 'en',
              created_at: new Date().toISOString(),
            };
            users.push({
              email: email.toLowerCase().trim(),
              passwordHash: btoa(password),
              profile: demoProfile,
            });
            localStorage.setItem(LOCAL_STORAGE_USERS_DB_KEY, JSON.stringify(users));
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoProfile));
            setUser(demoProfile);
            setIsLoading(false);
            return true;
          }

          setError('Invalid email or password. Please check your credentials.');
          setIsLoading(false);
          return false;
        }

        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(found.profile));
        setUser(found.profile);
        setIsLoading(false);
        return true;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
      setIsLoading(false);
      return false;
    }

    setIsLoading(false);
    return false;
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('profiles').update(updates).eq('id', user.id);
    } else {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        error,
        isRealSupabase: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        clearError,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
