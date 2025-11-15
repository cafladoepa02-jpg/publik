
import React, { useState } from 'react';
// FIX: Imported 'auth' instance for use with auth functions.
import { auth, signInWithGoogle, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../services/firebase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoginView, setIsLoginView] = useState(true);

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLoginView) {
        // FIX: Passed 'auth' as the first argument.
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // FIX: Passed 'auth' as the first argument.
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900/60 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?blur=5&random=1')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
      <div className="w-full max-w-md z-10">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl shadow-fuchsia-500/20 p-8 border border-slate-700">
          <h1 className="text-4xl font-bold text-center text-white font-fantasy mb-2">Welcome Scribe</h1>
          <p className="text-center text-violet-300 mb-8">{isLoginView ? 'Unlock your sanctuary' : 'Begin your journey'}</p>
          
          {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-md mb-6 text-center text-sm">{error}</p>}

          <form onSubmit={handleEmailPasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm bg-slate-900/50 text-white"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm bg-slate-900/50 text-white"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-slate-900 transition-all duration-300"
              >
                {isLoginView ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={signInWithGoogle}
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-slate-600 rounded-md shadow-sm bg-slate-700/50 text-sm font-medium text-gray-200 hover:bg-slate-700 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>
            
            <p className="mt-6 text-center text-sm text-gray-400">
              {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
              <button onClick={() => setIsLoginView(!isLoginView)} className="font-medium text-violet-400 hover:text-violet-300">
                {isLoginView ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
