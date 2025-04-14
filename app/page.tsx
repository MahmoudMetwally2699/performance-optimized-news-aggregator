import { Suspense } from 'react';
import { CategoryFilter } from './(components)/CategoryFilter';
import { SearchBar } from './(components)/SearchBar';
import { NewsCard } from './(components)/NewsCard';
import { NewsPreloader } from './(components)/NewsPreloader';
import { Pagination } from './(components)/Pagination';
import { fetchNews } from './lib/news-service';
import { getSession } from './lib/auth';

type SearchParams = { [key: string]: string | string[] | undefined };

interface HomePageProps {
  searchParams: SearchParams;
}

const Home = async ({ searchParams }: HomePageProps) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = params.category || 'general';
  const session = await getSession();

  try {
    const { articles, totalResults } = await fetchNews({
      page: page.toString(),
      pageSize: '12',
      category
    });

    const formattedArticles = articles.map(article => ({
      id: article._id?.toString() || article.url,
      url: article.url,
      title: article.title,
      description: article.description,
      content: article.content,
      publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString() : null,
      urlToImage: article.urlToImage,
      source: article.source,
      views: Number(article.views || 0),
      favorites: (article.favorites || []).map(f => f.toString()),
      isFavorited: false
    }));

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 mb-8">
          <h1 className="text-3xl font-bold">Latest News</h1>
          <SearchBar />
          <CategoryFilter />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formattedArticles.map(article => (
            <NewsCard
              key={article.id}
              article={article}
              userId={session?.id}
              showShare={true}
            />
          ))}
        </div>

        <Pagination total={totalResults} perPage={12} />
      </main>
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    return <div>Error loading news</div>;
  }
};

export default Home;
