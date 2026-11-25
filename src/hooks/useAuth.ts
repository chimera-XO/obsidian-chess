import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

function toSyntheticEmail(username: string): string {
  return `${username.trim().toLowerCase()}.obsidianchess@gmail.com`;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>('');
  const [initializing, setInitializing] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsername = useCallback(async (u: User | null) => {
    if (!u || !supabase) {
      setUsername('');
      return;
    }

    const metaName =
      typeof u.user_metadata?.username === 'string' ? u.user_metadata.username : '';

    try {
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', u.id)
        .maybeSingle();

      if (data?.username) {
        setUsername(data.username);
        return;
      }
    } catch {
      // fallback
    }

    setUsername(metaName || u.email?.split('.')[0] || 'Player');
  }, []);

  useEffect(() => {
    if (!supabase) {
      setInitializing(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      await loadUsername(currentUser);
      if (active) setInitializing(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      loadUsername(nextUser);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadUsername]);

  const signUp = useCallback(async (rawUsername: string, password: string) => {
    if (!supabase) {
      setError('Supabase is not configured. Check your .env.local keys.');
      return false;
    }

    const cleanUsername = rawUsername.trim();
    if (!USERNAME_REGEX.test(cleanUsername)) {
      setError('Username must be 3–20 characters (letters, numbers, or underscores only).');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email: toSyntheticEmail(cleanUsername),
        password,
        options: { data: { username: cleanUsername } },
      });

      if (signUpErr) {
        if (signUpErr.message.toLowerCase().includes('already registered')) {
          setError('That username is already taken.');
        } else {
          setError(signUpErr.message);
        }
        return false;
      }

      if (!data.session) {
        setError(
          'Account created, but email confirmation is enabled in Supabase. Turn off "Confirm email" in Supabase Auth -> Providers -> Email, then sign in.'
        );
        return false;
      }

      if (data.user) {
        await supabase
          .from('profiles')
          .upsert({ id: data.user.id, username: cleanUsername }, { onConflict: 'id' });
        setUsername(cleanUsername);
      }

      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed.');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const signIn = useCallback(async (rawUsername: string, password: string) => {
    if (!supabase) {
      setError('Supabase is not configured. Check your .env.local keys.');
      return false;
    }

    const cleanUsername = rawUsername.trim();
    if (!cleanUsername || !password) {
      setError('Enter both username and password.');
      return false;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: toSyntheticEmail(cleanUsername),
        password,
      });

      if (signInErr) {
        if (signInErr.message.toLowerCase().includes('invalid login')) {
          setError('Invalid username or password.');
        } else {
          setError(signInErr.message);
        }
        return false;
      }

      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed.');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setUsername('');
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    isSupabaseConfigured,
    user,
    username,
    initializing,
    submitting,
    error,
    signUp,
    signIn,
    signOut,
    clearError,
  };
}
