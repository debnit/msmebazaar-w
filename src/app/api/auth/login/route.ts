import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {email, password} = body;

    if (!email || !password) {
      return NextResponse.json(
        {error: 'Email and password are required'},
        {status: 400}
      );
    }

    console.log('Login attempt for:', email);

    // In a real application, you would verify the user's credentials against the database.
    // For this prototype, we'll simulate a successful login.

    return NextResponse.json(
      {message: 'Login successful', token: 'mock-jwt-token'},
      {status: 200}
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {error: 'An error occurred during login'},
      {status: 500}
    );
  }
}
