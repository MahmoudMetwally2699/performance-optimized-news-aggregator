'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackAnalytics } from '../lib/analytics-service';

interface FavoriteButtonProps {
  articleId: string;
  initialFavorited: boolean;
}

export function FavoriteButton({ articleId, initialFavorited }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any parent handlers
    e.stopPropagation();
    if (!articleId) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/articles/${articleId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (res.ok) {
        const newState = !isFavorited;
        setIsFavorited(newState);
        if (newState) {
          await trackAnalytics(articleId, 'favorite');
        }
        router.refresh();
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`
        group relative flex items-center justify-center w-9 h-9
        rounded-full backdrop-blur-lg transition-all duration-300
        ${isFavorited
          ? 'bg-pink-500/20 text-pink-500'
          : 'bg-gray-900/50 text-gray-400 hover:text-pink-500 hover:bg-pink-500/20'
        }
      `}
    >
      <span className={`
        transform transition-transform duration-300
        ${isFavorited ? 'scale-110' : 'group-hover:scale-110'}
      `}>
        {isFavorited ? '♥' : '♡'}
      </span>
    </button>
  );
}
