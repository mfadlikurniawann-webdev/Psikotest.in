import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth-edge';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Read auth token from cookies
  const token = request.cookies.get('auth_token')?.value;
  const user = token ? await verifyToken(token) : null;
  
  // Guard guest-only pages (login, register, root redirect)
  if (pathname === '/login' || pathname === '/register' || pathname === '/') {
    if (user) {
      if (user.role === 'hr') {
        return NextResponse.redirect(new URL('/hr/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
      }
    }
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
  
  // Guard candidate pages
  if (pathname.startsWith('/candidate')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role !== 'candidate') {
      return NextResponse.redirect(new URL('/hr/dashboard', request.url));
    }
    return NextResponse.next();
  }
  
  // Guard HR pages
  if (pathname.startsWith('/hr')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role !== 'hr') {
      return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
    }
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/candidate/:path*',
    '/hr/:path*'
  ]
};
