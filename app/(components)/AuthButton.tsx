'use client';

import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function AuthButton() {
  const { user, logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state while checking auth
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-24 h-10 bg-gray-800/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <Link
            href="/profile"
            className="px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300
              hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
          >
            {user.name}
          </Link>
          <button
            onClick={async () => {
              await logout();
              window.dispatchEvent(new Event('auth-change'));
            }}
            className="px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300
              hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            Sign Out
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300
            hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}
