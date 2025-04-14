import { connectDB } from './db';
import { Article } from '../models/Article';
import { getSession } from './auth';
import { NewsParams } from '../types';

export type NewsArticle = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
};

export type NewsResponse = {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
};

type NewsApiResponse = {
  articles: any[];
  status: string;
  totalResults: number;
};

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

export async function fetchNews(params: NewsParams = {}) {
  try {
    const searchParams = new URLSearchParams({
      apiKey: process.env.NEWS_API_KEY || '',
      language: 'en',
      pageSize: params.pageSize || '12',
      page: params.page || '1',
      category: params.category || 'general',
      ...Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
      )
    });

    const baseUrl = process.env.NEWS_API_BASE_URL;
    const url = `${baseUrl}/top-headlines?${searchParams}`;

    const res = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch news: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('News service error:', error);
    throw error;
  }
}

export async function getNews(params: Record<string, string | undefined> = {}): Promise<NewsResponse> {
  const searchParams = new URLSearchParams({
    apiKey: process.env.NEWS_API_KEY!,
    language: 'en',
    pageSize: '9',
    ...params
  });

  const response = await fetch(
    `${process.env.NEWS_API_BASE_URL}/top-headlines?${searchParams}`,
    { next: { revalidate: 300 } }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  const data = await response.json();
  const session = await getSession();

  await connectDB();

  // Save articles and get IDs
  const savedArticles = await Promise.all(
    data.articles.map(async (article: any) => {
      const saved = await Article.findOneAndUpdate(
        { url: article.url },
        {
          ...article,
          publishedAt: new Date(article.publishedAt)
        },
        { upsert: true, new: true, lean: true }
      );

      return {
        ...article,
        id: saved._id.toString(),
        isFavorited: saved.favorites?.includes(session?.id)
      };
    })
  );

  return {
    ...data,
    articles: savedArticles
  };
}
