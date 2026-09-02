import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingView } from './components/landing/LandingView';
import { DashboardView } from './components/dashboard/DashboardView';
import { ContactsView } from './components/contacts/ContactsView';
import { HistoryView } from './components/history/HistoryView';
import { LoginView } from './components/auth/LoginView';
import { SignupView } from './components/auth/SignupView';
import { SchemaInfoModal } from './components/database/SchemaInfoModal';
import { LanguageCode } from './types';
import { Button } from './components/ui/Button';
import { ArrowLeft, Shield } from 'lucide-react';

function AppContent() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'contacts' | 'history' | 'login' | 'signup'>('landing');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

  // Handle language updates from user profile preference if available
  React.useEffect(() => {
    if (user?.preferred_language) {
      setLanguage(user.preferred_language);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md mb-4 animate-pulse">
          <Shield className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-slate-800">Initializing Med AI Campus Safe...</p>
          <p className="text-xs text-slate-500">Checking secure authentication session</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      currentView={currentView}
      onNavigate={setCurrentView}
      language={language}
      onLanguageChange={setLanguage}
      user={user}
      isAuthenticated={isAuthenticated}
      onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
      onLogout={async () => {
        await signOut();
        setCurrentView('landing');
      }}
    >
      {currentView === 'landing' && (
        <LandingView
          language={language}
          onGetStarted={() => setCurrentView('dashboard')}
          onExploreContacts={() => {
            if (!isAuthenticated) {
              setCurrentView('login');
            } else {
              setCurrentView('contacts');
            }
          }}
        />
      )}

      {currentView === 'dashboard' && (
        <DashboardView
          language={language}
          onLanguageChange={setLanguage}
          onNavigateToContacts={() => {
            if (!isAuthenticated) {
              setCurrentView('login');
            } else {
              setCurrentView('contacts');
            }
          }}
          onNavigateToHistory={() => {
            if (!isAuthenticated) {
              setCurrentView('login');
            } else {
              setCurrentView('history');
            }
          }}
        />
      )}

      {currentView === 'login' && (
        <div className="space-y-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentView('landing')}
            >
              Back to Overview
            </Button>
          </div>
          <LoginView
            language={language}
            onSuccess={() => setCurrentView('dashboard')}
            onSwitchToSignup={() => setCurrentView('signup')}
          />
        </div>
      )}

      {currentView === 'signup' && (
        <div className="space-y-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentView('landing')}
            >
              Back to Overview
            </Button>
          </div>
          <SignupView
            language={language}
            onSuccess={() => setCurrentView('dashboard')}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        </div>
      )}

      {currentView === 'contacts' && (
        <ContactsView
          language={language}
          onBack={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'history' && (
        <HistoryView
          language={language}
          onBack={() => setCurrentView('dashboard')}
        />
      )}

      <SchemaInfoModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        language={language}
      />
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
