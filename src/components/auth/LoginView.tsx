import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { LanguageCode } from '../../types';

export interface LoginViewProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
  language: LanguageCode;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccess,
  onSwitchToSignup,
  language,
}) => {
  const { signIn, isLoading, error, clearError, isRealSupabase } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isHindi = language === 'hi';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signIn(email, password);
    if (success) {
      onSuccess();
    }
  };

  const fillDemoAccount = () => {
    setEmail('campus_student@university.edu');
    setPassword('SafetyFirst2026!');
    clearError();
  };

  return (
    <div className="max-w-md mx-auto space-y-6 py-6">
      <Card className="shadow-md border-slate-200">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl">
            {isHindi ? 'कैंपस लॉगिन (Sign In)' : 'Campus Sign In'}
          </CardTitle>
          <CardDescription>
            {isHindi
              ? 'अपने सुरक्षित मेड एआई खाते में प्रवेश करें।'
              : 'Sign in to access your incidents, contacts, and guidance history.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Supabase connection indicator */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isRealSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-sky-500'}`} />
              {isRealSupabase ? 'Supabase Auth Connected' : 'Demo Auth Engine Active'}
            </span>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer underline text-[11px]"
            >
              Fill Demo Login
            </button>
          </div>

          {error && (
            <div id="auth-error-alert" className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {isHindi ? 'ईमेल पता (Email)' : 'Campus Email Address'}
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="student@campus.edu"
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {isHindi ? 'पासवर्ड (Password)' : 'Password'}
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              id="login-submit-btn"
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isHindi ? 'लॉग इन करें' : 'Sign In'}
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600 space-y-2">
            <p>
              {isHindi ? 'खाता नहीं है?' : "Don't have an account?"}{' '}
              <button
                type="button"
                id="switch-to-signup-btn"
                onClick={onSwitchToSignup}
                className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
              >
                {isHindi ? 'नया खाता बनाएं (Sign Up)' : 'Create an Account'}
              </button>
            </p>
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Protected by Supabase Auth with Row-Level Security
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
