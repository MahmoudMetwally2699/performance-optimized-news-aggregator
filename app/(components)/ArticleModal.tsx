'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';

export function ArticleModal({
  isOpen,
  articleId,
  onClose
}: {
  isOpen: boolean;
  articleId?: string;
  onClose: () => void;
}) {
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    if (articleId) {
      fetch(`/api/articles/${articleId}`).then(res => res.json()).then(setArticle);
    }
  }, [articleId]);

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <button
          onClick={onClose}
          className="float-right text-2xl"
        >
          ×
        </button>

        {article.urlToImage && (
          <div className="relative w-full h-[400px] mb-8">
            <Image
              src={article.urlToImage}
              alt={article.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

        <div className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(article.content || article.description)
          }}
        />
      </div>
    </div>
  );
}
