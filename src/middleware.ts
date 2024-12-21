import { NextRequest, NextResponse } from 'next/server';
import getSession from '@/lib/session';

interface Urls {
  [key: string]: boolean;
}

const publicOnlyUrls: Urls = {
  '/': true,
  '/login': true,
  '/sms': true,
  '/create-account': true,
  '/github/start': true,
  '/github/complete': true,
};

export async function middleware(req: NextRequest) {
  console.log('middleware called!');
  const session = await getSession();
  const exists = publicOnlyUrls[req.nextUrl.pathname];

  if (!session.id) {
    if (!exists) {
      return NextResponse.redirect(new URL('/', req.nextUrl.toString()));
    }
  } else {
    if (exists) {
      return NextResponse.redirect(new URL('/home', req.nextUrl.toString()));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_next/public|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
