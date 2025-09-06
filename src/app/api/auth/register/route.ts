import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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

    const existingUser = await prisma.user.findUnique({
      where: {email},
    });

    if (existingUser) {
      return NextResponse.json(
        {error: 'User with this email already exists'},
        {status: 409}
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {message: 'User registered successfully', userId: user.id},
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
