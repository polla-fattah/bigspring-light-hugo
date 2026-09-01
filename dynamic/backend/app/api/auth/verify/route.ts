import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.toString().trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found matching this email address.' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Account is already verified. You can log in.',
        alreadyVerified: true
      });
    }

    if (!user.verificationCode || user.verificationCode !== cleanCode) {
      return NextResponse.json(
        { error: 'Invalid 6-digit verification code. Please check the security code and try again.' },
        { status: 400 }
      );
    }

    // Verify user email
    const updatedUser = await prisma.user.update({
      where: { email: cleanEmail },
      data: {
        emailVerified: new Date(),
        verificationCode: null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Email address verified successfully! Account is now active.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });

  } catch (error: any) {
    console.error('Verification API Error:', error);
    return NextResponse.json(
      { error: 'Failed to verify account. Please try again.' },
      { status: 500 }
    );
  }
}
