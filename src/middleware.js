import { NextResponse } from 'next/server';


const PROTECTED_ROUTES = ['/dashboard', '/onboarding'];

const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export function middleware(request) {
    const { pathname } = request.nextUrl;


    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';

    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    if (isProtectedRoute && !isLoggedIn) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/onboarding/:path*',
        '/sign-in',
        '/sign-up',
    ],
};
