import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// PUT /api/equipment/[id] - Update equipment profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await request.json();

    const updated = await prisma.equipment.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.model !== undefined ? { model: data.model } : {}),
        ...(data.specifications !== undefined ? { specifications: data.specifications } : {}),
        ...(data.totalUnits !== undefined ? { totalUnits: parseInt(data.totalUnits, 10) } : {})
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(`API Error in PUT /api/equipment/${id}:`, error);
    return NextResponse.json({ error: 'Failed to update equipment.' }, { status: 500 });
  }
}

// DELETE /api/equipment/[id] - Delete equipment profile
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.equipment.delete({
      where: { id }
    });
    return NextResponse.json({ success: true, message: 'Equipment deleted.' });
  } catch (error: any) {
    console.error(`API Error in DELETE /api/equipment/${id}:`, error);
    return NextResponse.json({ error: 'Failed to delete equipment.' }, { status: 500 });
  }
}
