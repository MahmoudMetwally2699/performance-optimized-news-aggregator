'use client';

export function NewsPreloader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
      <div className="relative w-40 h-40">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 border-2 border-blue-500/30 bg-gray-800/50
              animate-flip backdrop-blur-lg rounded-lg"
            style={{
              animationDelay: `${i * 0.2}s`,
              transform: `rotateY(${i * 15}deg) translateZ(${i * 10}px)`
            }}
          >
            <div className="p-4 space-y-2">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="h-2 bg-blue-500/20 rounded animate-pulse"
                  style={{ width: `${80 - j * 20}%` }}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <p className="text-blue-500 animate-pulse">Loading News...</p>
        </div>
      </div>
    </div>
  );
}
