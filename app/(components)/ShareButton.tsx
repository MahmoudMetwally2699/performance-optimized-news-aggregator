'use client';

interface ShareButtonProps {
  article: {
    id?: string;
    title: string;
    description?: string;
  };
}

export function ShareButton({ article }: ShareButtonProps) {
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      // Construct the article URL using window.location
      const articleUrl = `${window.location.origin}/article/${article.id}`;

      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: articleUrl
        });
      } else {
        await navigator.clipboard.writeText(articleUrl);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="group relative flex items-center justify-center w-9 h-9
        rounded-full bg-gray-900/50 backdrop-blur-lg
        text-gray-400 hover:text-blue-500 hover:bg-blue-500/20
        transition-all duration-300"
      aria-label="Share article"
    >
      <svg
        className="w-4 h-4 transform transition-transform duration-300 group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
    </button>
  );
}
