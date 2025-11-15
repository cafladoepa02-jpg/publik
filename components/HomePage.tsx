
import React from 'react';
import type { User } from '../types';

interface HomePageProps {
  user: User;
}

export const HomePage: React.FC<HomePageProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <div 
        className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl shadow-fuchsia-500/20 p-8 sm:p-12 border border-slate-700"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(139, 92, 246, 0.1), transparent 70%)`,
        }}
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white font-fantasy leading-tight">
          Welcome, Mystic Scribe
        </h2>
        <p className="mt-4 text-lg text-violet-200">
          Hello, {user?.displayName || user?.email}. Your sanctuary awaits.
        </p>
        <p className="mt-6 max-w-2xl mx-auto text-gray-400">
          This is your personal realm to weave words into stories, chronicle your journeys, and command mystical energies. Let your creativity flow and bring your imagination to life.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 hover:border-violet-500 transition-all duration-300">
            <h3 className="font-fantasy text-xl text-violet-300">Converse with the Oracle</h3>
            <p className="mt-2 text-gray-400 text-sm">Speak with an ancient intelligence. Ask questions, seek wisdom, and hear its voice in real-time.</p>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 hover:border-violet-500 transition-all duration-300">
            <h3 className="font-fantasy text-xl text-violet-300">Cast Visual Spells</h3>
            <p className="mt-2 text-gray-400 text-sm">Use your words as a magic wand. Transmute and enhance your images with powerful incantations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
