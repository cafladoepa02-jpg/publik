
import React from 'react';
import type { User, Page } from '../types';
import { Page as PageEnum } from '../types';
import { HomeIcon, BookIcon, MusicIcon, SparklesIcon, WandIcon, LogoutIcon } from './common/Icons';
import { auth, signOut } from '../services/firebase';

interface AppLayoutProps {
  user: User;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  children: React.ReactNode;
}

const navItems = [
  { page: PageEnum.Home, label: 'Home', icon: HomeIcon },
  { page: PageEnum.Writings, label: 'Writings', icon: BookIcon },
  { page: PageEnum.Music, label: 'Enchantments', icon: MusicIcon },
  { page: PageEnum.Oracle, label: 'Mystic Oracle', icon: SparklesIcon },
  { page: PageEnum.Spellbook, label: 'Spellbook', icon: WandIcon },
];

const Header: React.FC<Omit<AppLayoutProps, 'children'>> = ({ user, currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-fuchsia-500/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white font-fantasy cursor-pointer" onClick={() => setCurrentPage(PageEnum.Home)}>
              Mystic Scribe
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  currentPage === item.page
                    ? 'bg-violet-900 text-white shadow-md shadow-violet-500/30'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-400 text-sm">Welcome, {user?.displayName || user?.email}</span>
            <button onClick={handleSignOut} className="p-2 rounded-full hover:bg-slate-800 transition-colors">
              <LogoutIcon />
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => {
                  setCurrentPage(item.page);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentPage === item.page
                    ? 'bg-violet-900 text-white'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
            <div className="pt-4 pb-3 border-t border-slate-700">
                <div className="flex items-center px-3">
                    <div className="text-base font-medium leading-none text-white">{user?.displayName || user?.email}</div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                    <button onClick={handleSignOut} className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-800 hover:text-white">
                        <LogoutIcon className="w-5 h-5 mr-3"/>
                        Sign out
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500">
      <p>&copy; {new Date().getFullYear()} Mystic Scribe's Sanctuary. All rights reserved.</p>
      <p className="text-xs mt-1">Crafted with magic and code.</p>
    </div>
  </footer>
);

export const AppLayout: React.FC<AppLayoutProps> = ({ user, currentPage, setCurrentPage, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 bg-gradient-to-br from-slate-900 to-indigo-900/40">
      <Header user={user} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};
