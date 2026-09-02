import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded.' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), '../frontend/public/images/uploads');
    await mkdir(uploadsDir, { recursive: true });

    const savedUrls: string[] = [];

    for (const file of files) {
      if (!file.name || file.size === 0) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const ext = path.extname(file.name) || '.jpg';
      const cleanExt = ext.toLowerCase().replace(/[^a-z0-9.]/g, '');
      const uniqueId = crypto.randomBytes(6).toString('hex');
      const timestamp = Date.now();
      const filename = `upload-${timestamp}-${uniqueId}${cleanExt || '.jpg'}`;

      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);

      const publicUrl = `/images/uploads/${filename}`;
      savedUrls.push(publicUrl);
    }

    if (savedUrls.length === 0) {
      return NextResponse.json({ error: 'Failed to process files.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: savedUrls[0],
      urls: savedUrls
    });
  } catch (error: any) {
    console.error('API Error in POST /api/upload:', error);
    return NextResponse.json({ error: 'Failed to upload files.' }, { status: 500 });
  }
}
