import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const list = await prisma.equipmentReservation.findMany({
      include: {
        equipment: {
          select: {
            name: true,
            lab: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Generate CSV content safely
    const headers = [
      'Reservation ID', 
      'Equipment Name', 
      'Laboratory', 
      'User Name', 
      'User Email', 
      'User Type', 
      'Purpose', 
      'Start Time', 
      'End Time', 
      'Status', 
      'Created At'
    ];
    
    const rows = list.map(r => [
      r.id,
      `"${r.equipment.name.replace(/"/g, '""')}"`,
      `"${(r.equipment.lab?.title || '').replace(/"/g, '""')}"`,
      `"${r.userName.replace(/"/g, '""')}"`,
      `"${r.userEmail.replace(/"/g, '""')}"`,
      r.userType,
      `"${r.purpose.replace(/"/g, '""')}"`,
      r.startTime.toISOString(),
      r.endTime.toISOString(),
      r.status,
      r.createdAt.toISOString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="reservations_export.csv"',
      }
    });
  } catch (error) {
    console.error('Error generating CSV export:', error);
    return NextResponse.json({ error: 'Failed to export reservations to CSV.' }, { status: 500 });
  }
}
