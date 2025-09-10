import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';
import { nanoid } from 'nanoid';

async function generateUniqueReferralCode(): Promise<string> {
    let referralCode;
    let isUnique = false;
    while (!isUnique) {
        referralCode = nanoid(8).toUpperCase();
        const existingUser = await prisma.user.findUnique({
            where: { referralCode },
        });
        if (!existingUser) {
            isUnique = true;
        }
    }
    return referralCode!;
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {name, email, password, referralCode: incomingReferralCode } = body;

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
    
    // Check if this is the first user
    const userCount = await prisma.user.count();
    const isAdmin = userCount === 0;

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = await generateUniqueReferralCode();

    const userData: any = {
        name,
        email,
        password: hashedPassword,
        isAdmin,
        referralCode,
    };

    if (incomingReferralCode) {
        const referringUser = await prisma.user.findUnique({
            where: { referralCode: incomingReferralCode },
        });

        if (referringUser) {
            userData.referredById = referringUser.id;
        }
    }

    const user = await prisma.user.create({
      data: userData,
    });

    // Automatically log the user in after registration
    await login({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin });

    return NextResponse.json(
      {message: 'User registered and logged in successfully', userId: user.id},
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
