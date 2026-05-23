import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// List of paths that don't require authentication
const publicPaths = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isPublicPath = publicPaths.some(p => pathname.startsWith(p));
  const token = request.cookies.get('token')?.value;

  if (isPublicPath) {
    if (token) {
      try {
        await jwtVerify(token, SECRET);
        // If valid token trying to access auth pages, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
      } catch {
        // Invalid token, allow access to auth page
      }
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch (e) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  // Apply middleware to all routes except API routes, static assets, and Next.js internal files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|\\.png).*)'],
};