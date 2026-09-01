import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { role } = await request.json();

    if (!role || !['superadmin', 'lab_staff', 'researcher'].includes(role)) {
      return NextResponse.json({ error: 'Invalid user role parameter.' }, { status: 400 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Update user role
    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(`API Error in PATCH /api/users/${id}/role:`, error);
    return NextResponse.json({ error: 'Failed to update user role.' }, { status: 500 });
  }
}
