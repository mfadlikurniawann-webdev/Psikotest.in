import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'candidate') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { positionApplied } = await req.json();

    if (!positionApplied || positionApplied.trim() === '') {
      return NextResponse.json({ error: 'Posisi yang dilamar wajib diisi' }, { status: 400 });
    }

    // Update the position in users table
    await sql`
      UPDATE users
      SET position_applied = ${positionApplied.trim()},
          updated_at = NOW()
      WHERE id = ${user.id}
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Update Position API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
