import {NextRequest, NextResponse} from 'next/server';
import {Loader} from 'lucide-react';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({error: 'No code found'}, {status: 400});
  }

  // In a real app, you would exchange the code for an access token,
  // then fetch the user's profile from Google,
  // then sign the user in (e.g. create a session and issue a JWT)

  return NextResponse.redirect('/dashboard');
}
