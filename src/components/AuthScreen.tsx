import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

interface AuthScreenProps {
  isConfigured: boolean;
  submitting: boolean;
  error: string | null;
  onSignIn: (username: string, password: string) => Promise<boolean>;
  onSignUp: (username: string, password: string) => Promise<boolean>;
  onClearError: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  isConfigured,
  submitting,
  error,
  onSignIn,
  onSignUp,
  onClearError,
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const switchTab = (next: 'signin' | 'signup') => {
    setTab(next);
    setLocalError(null);
    onClearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    onClearError();

    if (tab === 'signup') {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
      await onSignUp(username, password);
    } else {
      await onSignIn(username, password);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-sm glass-panel rounded-3xl p-6 sm:p-7 space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 mx-auto flex items-center justify-center text-2xl shadow-inner">
            ♞
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">Obsidian Chess</h1>
          <p className="text-xs text-zinc-400">
            Stockfish WASM · PvP Rooms · Puzzles · Live Coach
          </p>
        </div>

        {!isConfigured ? (
          <div className="flex items-start gap-2.5 text-xs text-zinc-300 bg-zinc-900/90 border border-white/10 rounded-xl p-3.5">
            <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="font-semibold text-zinc-100">Supabase Keys Required</p>
              <p className="text-zinc-400 leading-relaxed">
                Add <code className="font-mono text-zinc-200">VITE_SUPABASE_URL</code> and{' '}
                <code className="font-mono text-zinc-200">VITE_SUPABASE_ANON_KEY</code> to{' '}
                <code className="font-mono text-zinc-200">.env.local</code>, then restart Vite.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-950/80 border border-white/5">
              <button
                type="button"
                onClick={() => switchTab('signin')}
                className={`py-2 rounded-lg text-xs font-semibold transition ${
                  tab === 'signin'
                    ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchTab('signup')}
                className={`py-2 rounded-lg text-xs font-semibold transition ${
                  tab === 'signup'
                    ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">
                  {tab === 'signup' ? 'Choose Username' : 'Username'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={tab === 'signup' ? 'e.g. magnus_99' : 'Enter username'}
                    className="w-full bg-zinc-950/80 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
                {tab === 'signup' && (
                  <p className="text-[11px] text-zinc-500">
                    3–20 characters · letters, numbers, underscores
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">
                  {tab === 'signup' ? 'Set Password' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={tab === 'signup' ? 'Min. 6 characters' : 'Enter password'}
                    className="w-full bg-zinc-950/80 border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {tab === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-zinc-950/80 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>
              )}

              {displayError && (
                <div className="text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded-xl px-3 py-2.5 leading-relaxed">
                  {displayError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-950 font-semibold text-sm transition shadow-lg"
              >
                {submitting
                  ? tab === 'signup'
                    ? 'Creating Account...'
                    : 'Signing In...'
                  : tab === 'signup'
                  ? 'Create Account'
                  : 'Sign In'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
