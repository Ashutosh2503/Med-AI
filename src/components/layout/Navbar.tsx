import React from 'react';
import { Shield, Activity, Users, History, Globe, User, LogOut } from 'lucide-react';
import { LanguageCode, UserProfile } from '../../types';

export interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'contacts' | 'history' | 'login' | 'signup';
  onNavigate: (view: 'landing' | 'dashboard' | 'contacts' | 'history' | 'login' | 'signup') => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  user?: UserProfile | null;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  language,
  onLanguageChange,
  user,
  isAuthenticated = false,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            id="brand-logo-btn"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Med AI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Campus Safe
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">First-Aid & Emergency Companion</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-home-btn"
              onClick={() => onNavigate('landing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'landing'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>
            <button
              id="nav-dashboard-btn"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'dashboard'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4 h-4" />
              Incident Workspace
            </button>
            <button
              id="nav-contacts-btn"
              onClick={() => onNavigate('contacts')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'contacts'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              Emergency Contacts
            </button>
            <button
              id="nav-history-btn"
              onClick={() => onNavigate('history')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'history'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4" />
              History
            </button>
          </nav>

          {/* Right Action Bar (Language + Auth) */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1 hidden sm:inline-block" />
              <button
                id="lang-toggle-en"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                id="lang-toggle-hi"
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Auth Controls */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-semibold truncate max-w-[110px]">{user.name}</span>
                </div>
                <button
                  id="auth-logout-btn"
                  onClick={onLogout}
                  title="Sign Out"
                  className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-rose-700 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="auth-login-btn"
                  onClick={() => onNavigate('login')}
                  className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  id="auth-signup-btn"
                  onClick={() => onNavigate('signup')}
                  className="text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
