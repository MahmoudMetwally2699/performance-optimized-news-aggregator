'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const categories = [
  'general',
  'business',
  'technology',
  'entertainment',
  'health',
  'science',
  'sports'
];

export function CategoryFilter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'general';

  return (
    <nav className="overflow-x-auto flex gap-2 pb-2 scrollbar-hide">
      {categories.map(category => (
        <Link
          key={category}
          href={`/?category=${category}`}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all
            ${currentCategory === category
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'}
          `}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>
      ))}
    </nav>
  );
}
