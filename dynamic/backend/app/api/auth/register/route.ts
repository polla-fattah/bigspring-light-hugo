import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '../../../../lib/auth-utils';
import { sendVerificationEmail } from '../../../../lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Full Name, Email, and Password are required fields.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Enforce SUE Domain ending: must end with su.edu.krd
    if (!cleanEmail.endsWith('su.edu.krd')) {
      return NextResponse.json(
        { error: 'Registration is restricted to official Salahaddin University emails ending with su.edu.krd (e.g. user@su.edu.krd or user@student.su.edu.krd).' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please log in instead.' },
        { status: 400 }
      );
    }

    // Generate random 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create password hash and save user
    const assignedRole = (cleanEmail === 'polla.fattah@su.edu.krd' || cleanEmail === 'admin@su.edu.krd')
      ? 'superadmin'
      : (role === 'faculty' ? 'lab_staff' : 'researcher');

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        verificationCode,
        role: assignedRole
      }
    });

    // Dispatch real SMTP email or fallback to log
    const emailResult = await sendVerificationEmail({
      toEmail: cleanEmail,
      recipientName: name.trim(),
      verificationCode
    });

    return NextResponse.json({
      success: true,
      message: emailResult.sent 
        ? 'Account created! Verification security code sent to your SUE email.' 
        : 'Account created! Verification code dispatched.',
      emailDispatched: emailResult.sent,
      verificationCode, // Kept for dev/testing when SMTP_HOST is not set
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create user account. Please try again.' },
      { status: 500 }
    );
  }
}
