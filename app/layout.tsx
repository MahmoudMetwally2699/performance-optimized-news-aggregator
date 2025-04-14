import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './context/auth-provider';
import { AuthButton } from './(components)/AuthButton';
import { StrictMode, Suspense } from 'react';
import Link from 'next/link';
import { NewsPreloader } from './(components)/NewsPreloader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "News Aggregator",
  description: "Stay updated with the latest news from around the world",
  keywords: "news, articles, headlines, world news, technology, sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StrictMode>
      <html lang="en" className="dark">
        <body className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
          <div className="backdrop-blur-3xl">
            <AuthProvider>
              <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
                <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                  {/* Logo section */}
                  <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
                    <span className="text-blue-500 text-2xl animate-pulse">📰</span>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                      NewsHub
                    </h1>
                  </Link>

                  {/* Navigation items */}
                  <div className="flex items-center gap-6">
                    <AuthButton />
                  </div>
                </nav>
              </header>

              <main className="flex-1 min-h-[calc(100vh-12rem)]">
                <Suspense fallback={<NewsPreloader />}>
                  {children}
                </Suspense>
              </main>

              <footer className="bg-gray-900/80 border-t border-gray-800 mt-auto">
                <div className="container mx-auto px-4 py-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">About NewsHub</h3>
                      <p className="text-gray-400">
                        Stay informed with the latest news from around the world, curated just for you.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        Quick Links
                      </h3>
                      <div className="flex flex-col gap-3">
                        <Link
                          href="/"
                          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span>Home</span>
                        </Link>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        Categories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {['technology', 'business', 'sports'].map(category => (
                          <Link
                            key={category}
                            href={`/?category=${category}`}
                            className="text-sm px-4 py-1.5 bg-gray-800/50 rounded-full text-gray-400
                              hover:bg-blue-500/10 hover:text-white transition-all duration-300
                              border border-transparent hover:border-blue-500/20"
                          >
                            {category}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p>© 2024 NewsHub. All rights reserved.</p>
                  </div>
                </div>
              </footer>
            </AuthProvider>
          </div>
        </body>
      </html>
    </StrictMode>
  );
}
