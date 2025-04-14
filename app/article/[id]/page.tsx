import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';
import { Article } from '../../models/Article';
import { connectDB } from '../../lib/db';
import { NewsCard } from '../../(components)/NewsCard';
import { ReadingProgress } from '../../(components)/ReadingProgress';
import { ShareButton } from '../../(components)/ShareButton';
import { FavoriteButton } from '../../(components)/FavoriteButton';
import { getSession } from '../../lib/auth';
import { TrackAnalytics } from '../../(components)/TrackAnalytics';
import { serializeMongoDoc } from '../../lib/utils';
import '../../styles/article.css';

export default async function ArticlePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const session = await getSession();
  await connectDB();

  try {
    const [article, recommendations] = await Promise.all([
      Article.findById(id),
      Article.find({ _id: { $ne: id } }).limit(3).lean()
    ]);

    if (!article) notFound();

    // Safely serialize article and recommendations
    const serializedArticle = serializeMongoDoc(article);
    const serializedRecommendations = recommendations
      .filter(rec => rec) // Filter out any null/undefined values
      .map(rec => serializeMongoDoc(rec))
      .filter(rec => rec && rec.id); // Only keep successfully serialized articles

    // Check if article is favorited by current user
    const isFavorited = session?.id && serializedArticle?.favorites?.includes(session.id);

    // Only track view if user is logged in and article exists
    if (session?.id && typeof session.id === 'string' && article) {
      await article.addView(session.id);
    }

    return (
      <>
        {session?.id && <TrackAnalytics articleId={id} action="view" />}
        <ReadingProgress />

        <article className="relative min-h-screen">
          {/* Hero Section */}
          <div className="relative h-[70vh] w-full">
            <Image
              src={serializedArticle.urlToImage || '/placeholder-news.jpg'}
              alt={serializedArticle.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50" />

            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <FavoriteButton articleId={id} initialFavorited={isFavorited} />
              <ShareButton
                article={{
                  id,
                  title: serializedArticle.title,
                  description: serializedArticle.description
                }}
              />
            </div>

            {/* Hero Content */}
            <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-gray-900">
              <div className="container mx-auto max-w-4xl">
                <div className="flex items-center gap-2 text-blue-400 mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm
                    border border-blue-500/20 text-sm">
                    {serializedArticle.source.name}
                  </span>
                  <time className="text-sm">
                    {new Date(serializedArticle.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {serializedArticle.title}
                </h1>
                {serializedArticle.description && (
                  <p className="text-xl text-gray-300 max-w-3xl">
                    {serializedArticle.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Article Meta */}
              <div className="flex items-center gap-4 mb-8 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{serializedArticle.readingTime || '5 min read'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span>Share this article</span>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg prose-invert mx-auto">
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(serializedArticle.content || '')
                  }}
                />
              </div>

              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={serializedArticle.source.icon || '/placeholder-source.png'}
                      alt={serializedArticle.source.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-white">{serializedArticle.source.name}</p>
                      <p className="text-sm text-gray-400">Original Article</p>
                    </div>
                  </div>
                  <a
                    href={serializedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400
                      hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                  >
                    Read on {serializedArticle.source.name} →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <section className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800">
            <div className="container mx-auto px-4 py-16">
              <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-500
                to-purple-500 bg-clip-text text-transparent">
                Recommended Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {serializedRecommendations.map(rec => (
                  <NewsCard
                    key={rec.id}
                    article={rec}
                    userId={session?.id as string | undefined}
                  />
                ))}
              </div>
            </div>
          </section>
        </article>
      </>
    );
  } catch (error) {
    console.error('Error loading article:', error);
    throw error; // Let Next.js error boundary handle it
  }
}
