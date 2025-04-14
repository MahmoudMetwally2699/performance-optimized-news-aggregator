import { getSession } from '../lib/auth';
import { Article } from '../models/Article';
import { NewsCard } from '../(components)/NewsCard';

async function getRecommendations(userId: string) {
  // Get user's favorite categories and sources
  const userHistory = await Article.find({ 'views.userId': userId });
  const categories = [...new Set(userHistory.map(a => a.category))];
  const sources = [...new Set(userHistory.map(a => a.source.name))];

  // Find similar articles
  return Article.find({
    $or: [
      { category: { $in: categories } },
      { 'source.name': { $in: sources } }
    ],
    'views.userId': { $ne: userId }
  })
  .sort('-publishedAt')
  .limit(9);
}

export default async function RecommendationsPage() {
  const session = await getSession();
  const recommendations = session ? await getRecommendations(session.id) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Recommended For You</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(article => (
          <NewsCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  );
}
