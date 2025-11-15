
import React, { useState, useEffect } from 'react';
// FIX: Imported 'auth' instance for use with onAuthStateChanged.
import { auth, onAuthStateChanged } from './services/firebase';
import type { User, Page } from './types';
import { Page as PageEnum } from './types';

import { AppLayout } from './components/AppLayout';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { WritingsPage } from './components/WritingsPage';
import { MusicPlayerPage } from './components/MusicPlayerPage';
import { MysticalOraclePage } from './components/MysticalOraclePage';
import { SpellbookPage } from './components/SpellbookPage';
import LoadingSpinner from './components/common/LoadingSpinner';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>(PageEnum.Home);

  useEffect(() => {
    // FIX: Passed 'auth' as the first argument to onAuthStateChanged.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case PageEnum.Home:
        return <HomePage user={user} />;
      case PageEnum.Writings:
        return <WritingsPage />;
      case PageEnum.Music:
        return <MusicPlayerPage />;
      case PageEnum.Oracle:
        return <MysticalOraclePage />;
      case PageEnum.Spellbook:
        return <SpellbookPage />;
      default:
        return <HomePage user={user} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner text="Awakening the Sanctuary..." />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AppLayout user={user} currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderCurrentPage()}
    </AppLayout>
  );
};

export default App;
