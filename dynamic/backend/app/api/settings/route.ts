import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  try {
    const list = await prisma.systemSettings.findMany();
    const settingsMap = list.reduce((acc, curr) => {
      acc[curr.keyName] = curr.valueText;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(settingsMap);
  } catch (error: any) {
    console.error('API Error in GET /api/settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json(); // Object containing key-value configurations

    for (const key of Object.keys(body)) {
      await prisma.systemSettings.upsert({
        where: { keyName: key },
        update: { valueText: body[key] },
        create: { keyName: key, valueText: body[key] }
      });
    }

    return NextResponse.json({ success: true, message: 'System settings updated successfully.' });
  } catch (error: any) {
    console.error('API Error in PUT /api/settings:', error);
    return NextResponse.json({ error: 'Failed to update system settings.' }, { status: 500 });
  }
}
