'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { NewsCard } from './NewsCard';
import { CategoryFilter } from './CategoryFilter';
import { SearchBar } from './SearchBar';

interface Article {
  _id?: string;
  url: string;
  title: string;
  description?: string;
  content?: string;
  publishedAt?: string;
  urlToImage?: string;
  source?: {
    id?: string;
    name?: string;
  };
  views?: number;
  favorites?: string[];
}

export function ClientNewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      const res = await fetch(`/api/news?${params}`);
      const data = await res.json();
      setArticles(data.articles);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <CategoryFilter />
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsCard
            key={article.url}
            article={article}
            showShare={true}
          />
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        <button
          onClick={() => {
            const page = Number(searchParams.get('page') || '1');
            const params = new URLSearchParams(searchParams);
            params.set('page', (page - 1).toString());
            router.push(`/?${params}`);
          }}
          disabled={!searchParams.get('page') || searchParams.get('page') === '1'}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => {
            const page = Number(searchParams.get('page') || '1');
            const params = new URLSearchParams(searchParams);
            params.set('page', (page + 1).toString());
            router.push(`/?${params}`);
          }}
          className="px-4 py-2 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
