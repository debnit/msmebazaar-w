import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

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

    const user = await prisma.user.findUnique({
      where: {email},
    });

    if (!user) {
      return NextResponse.json({error: 'Invalid credentials'}, {status: 401});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({error: 'Invalid credentials'}, {status: 401});
    }

    // The user object must be passed inside a 'user' key.
    const { token } = await login({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin });

    return NextResponse.json(
      {message: 'Login successful', user, token},
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
