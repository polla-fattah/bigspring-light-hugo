import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Secret key validation check to secure sync trigger
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const expectedSecret = process.env.CMS_SYNC_SECRET || 'sue_portal_sync_secret_token_2026';

    if (secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized sync trigger.' }, { status: 401 });
    }

    console.log('Triggering PostgreSQL Database Sync with Hugo Content...');
    
    // Execute prisma db seed command programmatically
    const { stdout, stderr } = await execPromise('npx prisma db seed');
    
    return NextResponse.json({
      success: true,
      message: 'PostgreSQL database successfully synchronized with Hugo markdown files.',
      stdout,
      stderr
    });
  } catch (error: any) {
    console.error('API Error in POST /api/cms/sync:', error);
    return NextResponse.json(
      { error: 'Failed to synchronize database with Hugo files.', details: error.message || error },
      { status: 500 }
    );
  }
}
