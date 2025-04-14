'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to sign up');
      }

      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-blue-500/[0.02] -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 animate-gradient" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-gray-900/50 to-gray-900" />
      </div>

      <div className="w-full max-w-md p-8 mx-4">
        <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-400 mt-2">Join us for personalized news</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-gray-300" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700
                  text-white placeholder-gray-400 focus:outline-none focus:border-blue-500
                  transition-colors"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700
                  text-white placeholder-gray-400 focus:outline-none focus:border-blue-500
                  transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700
                  text-white placeholder-gray-400 focus:outline-none focus:border-blue-500
                  transition-colors"
                placeholder="Choose a password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600
                text-white rounded-lg font-medium hover:from-blue-500 hover:to-purple-500
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50
                transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="text-gray-400">Already have an account?</span>
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
