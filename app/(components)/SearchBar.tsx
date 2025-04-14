'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('q')?.toString();

    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    // Reset to page 1 when searching
    params.delete('page');

    router.push(`/?${params.toString()}`);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <input
        type="search"
        name="q"
        placeholder="Search news..."
        defaultValue={searchParams.get('q') || ''}
        className="w-full px-5 py-3 rounded-full bg-gray-800/50 border border-gray-700/50
          text-gray-100 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
          transition-all duration-300"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full
          bg-blue-600 text-white hover:bg-blue-500
          disabled:opacity-50 disabled:hover:bg-blue-600
          transition-all duration-300"
      >
        {isLoading ? (
          <span className="block w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </button>
    </form>
  );
}
