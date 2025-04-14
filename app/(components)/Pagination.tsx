'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function Pagination({ total, perPage = 12 }: { total: number; perPage?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(total / perPage);

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `/?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <button
          onClick={() => router.push(createPageURL(currentPage - 1))}
          className="px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-blue-500/10
            hover:text-white transition-all duration-300 border border-transparent
            hover:border-blue-500/20"
        >
          Previous
        </button>
      )}

      {currentPage < totalPages && (
        <button
          onClick={() => router.push(createPageURL(currentPage + 1))}
          className="px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-blue-500/10
            hover:text-white transition-all duration-300 border border-transparent
            hover:border-blue-500/20"
        >
          Next
        </button>
      )}
    </div>
  );
}
