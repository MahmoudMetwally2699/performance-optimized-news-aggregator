'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { NewsArticle } from '../lib/news-service';
import { ArticleModal } from './ArticleModal';
import { useRouter } from 'next/navigation';
import { FavoriteButton } from './FavoriteButton';
import { ShareButton } from './ShareButton';
import { formatDistanceToNow } from 'date-fns';

interface NewsArticle {
  id: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  favorites?: string[];
  isFavorited?: boolean;
}

interface NewsCardProps {
  article: NewsArticle;
  userId?: string;
  showShare?: boolean;
}

function estimateReadingTime(text: string | null | undefined): number {
  if (!text) return 1; // Default to 1 minute for empty content
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function NewsCard({ article, userId, showShare = false }: NewsCardProps) {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const isFavorited = article.isFavorited || (userId && article.favorites?.includes(userId)) || false;

  const readingTime = estimateReadingTime(article.description);

  const handleClick = async () => {
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      });

      if (!res.ok) throw new Error('Failed to save article');
      const { id } = await res.json();

      router.push(`/article/${id}`);
    } catch (error) {
      console.error('Error handling article click:', error);
    }
  };

  const publishedDate = new Date(article.publishedAt);

  return (
    <article
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col rounded-2xl overflow-hidden
        bg-gradient-to-br from-gray-900/90 to-gray-800/90
        border border-gray-700/50 hover:border-blue-500/50
        backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/10
        transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={article.urlToImage || '/placeholder-news.jpg'}
          alt={article.title}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

        {/* Category Tag */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full
          bg-blue-500/20 backdrop-blur-md border border-blue-500/20
          text-xs font-medium text-blue-300">
          {article.source.name}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <FavoriteButton articleId={article.id} initialFavorited={isFavorited} />
          {showShare && (
            <ShareButton article={article} />
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-5">
        <h2 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-blue-400
          transition-colors duration-300">
          {article.title}
        </h2>

        <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
          {article.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-500" />
            <time>{formatDistanceToNow(publishedDate, { addSuffix: true })}</time>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-4 h-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            <span>Read more</span>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      </div>
    </article>
  );
}
