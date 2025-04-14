import { redirect } from 'next/navigation';
import { getSession } from '../lib/auth';
import { Article } from '../models/Article';
import { NewsCard } from '../(components)/NewsCard';
import mongoose from 'mongoose';
import { connectDB } from '../lib/db';
import { Analytics } from '../models/Analytics';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface SerializedArticle {
  id: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string | null;
  source: {
    id: string | null;
    name: string;
  };
  views: Array<{
    userId: string;
    viewedAt: string;
  }>;
  favorites: string[];
}

// Add utility functions for safe conversion
function toSafeString(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value.toString === 'function') return value.toString();
  return '';
}

function toSafeDate(date: any): string | null {
  if (!date) return null;
  try {
    return new Date(date).toISOString();
  } catch {
    return null;
  }
}

function serializeArticle(doc: any): SerializedArticle {
  // Safely handle MongoDB document conversion
  const article = typeof doc.toObject === 'function'
    ? doc.toObject()
    : { ...doc };

  return {
    id: toSafeString(article._id),
    title: article.title || '',
    description: article.description || '',
    url: article.url || '',
    urlToImage: article.urlToImage || '',
    publishedAt: toSafeDate(article.publishedAt),
    source: {
      id: article.source?.id || null,
      name: article.source?.name || 'Unknown'
    },
    views: Array.isArray(article.views) ? article.views.map((v: any) => ({
      userId: toSafeString(v.userId),
      viewedAt: toSafeDate(v.viewedAt) || toSafeDate(new Date())
    })) : [],
    favorites: Array.isArray(article.favorites)
      ? article.favorites.map((f: any) => toSafeString(f))
      : []
  };
}

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  await connectDB();
  const userId = new mongoose.Types.ObjectId(session.id);

  const [favorites, history, analytics] = await Promise.all([
    Article.find({ favorites: userId })
      .select('title description url urlToImage publishedAt source')
      .lean(),
    Article.aggregate([
      {
        $match: {
          'views.userId': userId
        }
      },
      {
        $addFields: {
          lastViewedAt: {
            $max: {
              $filter: {
                input: '$views',
                as: 'view',
                cond: { $eq: ['$$view.userId', userId] },
                limit: 1
              }
            }
          }
        }
      },
      { $sort: { 'lastViewedAt.viewedAt': -1 } },
      { $limit: 6 },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          url: 1,
          urlToImage: 1,
          publishedAt: 1,
          source: 1,
          lastViewedAt: 1
        }
      }
    ]),
    Analytics.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          lastAction: { $max: '$timestamp' }
        }
      }
    ])
  ]);

  console.log('Analytics data:', analytics); // Debug log

  console.log(`Found ${history.length} history items`);
  console.log(`Found ${favorites.length} favorites`);

  // No need to serialize again since we did it in the query
  const serializedHistory = history;
  const serializedFavorites = favorites;

  const stats = {
    views: analytics.find(a => a._id === 'view')?.count || 0,
    shares: analytics.find(a => a._id === 'share')?.count || 0,
    favorites: analytics.find(a => a._id === 'favorite')?.count || 0,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <div className="relative mb-12 p-8 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-gray-800">
        <div className="absolute inset-0 bg-grid-white/[0.02] rounded-2xl" />
        <div className="relative">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Articles Read', value: stats.views, icon: '📚' },
              { label: 'Favorites', value: stats.favorites, icon: '⭐' },
              { label: 'Shares', value: stats.shares, icon: '🔗' }
            ].map((stat, index) => (
              <div key={`stat-${stat.label}-${index}`}
                className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800
                  hover:border-blue-500/20 hover:bg-blue-500/5 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {serializedHistory.map((article, index) => (
              <div key={`history-${article.id}-${index}`}
                className="p-4 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800
                  hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={article.urlToImage || '/placeholder-news.jpg'}
                      alt={article.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">{article.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Favorites */}
        <section className="h-full">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Favorite Articles
          </h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700">
            {serializedFavorites.map((article, index) => (
              <div key={`favorite-${article.id}-${index}`}
                className="group relative p-4 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800
                  hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={article.urlToImage || '/placeholder-news.jpg'}
                      alt={article.title}
                      fill
                      className="object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent rounded-md" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {article.source.name} · {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
