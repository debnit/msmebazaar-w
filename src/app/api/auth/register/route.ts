import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {name, email, password} = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {error: 'Missing required fields'},
        {status: 400}
      );
    }

    console.log('User registration data:', {name, email});

    // In a real application, you would hash the password and save the user to the database.
    // For now, we'll just simulate a successful registration.

    return NextResponse.json(
      {message: 'User registered successfully'},
      {status: 201}
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {error: 'An error occurred during registration'},
      {status: 500}
    );
  }
}
