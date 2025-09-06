import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
  const googleLoginUrl = new URL(
    'https://accounts.google.com/o/oauth2/v2/auth'
  );

  googleLoginUrl.searchParams.set(
    'scope',
    'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
  );
  googleLoginUrl.searchParams.set('response_type', 'code');
  googleLoginUrl.searchParams.set('redirect_uri', 'http://localhost:9002/api/auth/google/callback');
  googleLoginUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);

  return NextResponse.redirect(googleLoginUrl);
}
