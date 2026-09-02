import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { LanguageCode, UserProfile } from '../../types';

export interface AppLayoutProps {
  children: React.ReactNode;
  currentView: 'landing' | 'dashboard' | 'contacts' | 'history' | 'login' | 'signup';
  onNavigate: (view: 'landing' | 'dashboard' | 'contacts' | 'history' | 'login' | 'signup') => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  user?: UserProfile | null;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentView,
  onNavigate,
  language,
  onLanguageChange,
  user,
  isAuthenticated,
  onLogout,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar
        currentView={currentView}
        onNavigate={onNavigate}
        language={language}
        onLanguageChange={onLanguageChange}
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
      />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};
