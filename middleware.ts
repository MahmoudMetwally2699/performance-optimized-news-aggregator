import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                    request.nextUrl.pathname.startsWith('/signup') ||
                    request.nextUrl.pathname.startsWith('/register');
  const isProfilePage = request.nextUrl.pathname.startsWith('/profile');

  // If trying to access auth pages while logged in
  if (isAuthPage && token) {
    const from = request.nextUrl.searchParams.get('from');
    return NextResponse.redirect(new URL(from || '/', request.url));
  }

  // If trying to access profile while logged out
  if (isProfilePage && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  // Prevent caching for authenticated routes
  if (token) {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '-1');
  }

  return response;
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/register',
    '/profile/:path*'
  ]
};
