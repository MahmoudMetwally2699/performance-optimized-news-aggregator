'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
        <h2 className="text-xl font-semibold">Something went wrong loading the news</h2>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
