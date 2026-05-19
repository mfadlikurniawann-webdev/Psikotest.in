import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function DELETE(req, { params }) {
  try {
    const token = cookies().get('auth_token')?.value;
    const user = await verifyToken(token);
    if (!user || user.role !== 'hr') {
      return NextResponse.json({ error: 'Unauthorized' }, 401);
    }

    const { id } = params;

    // Verify candidate exists and has candidate role
    const candidates = await sql`
      SELECT id FROM users WHERE id = ${id} AND role = 'candidate' LIMIT 1
    `;
    if (candidates.length === 0) {
      return NextResponse.json({ error: 'Kandidat tidak ditemukan' }, 404);
    }

    // Delete candidate
    await sql`
      DELETE FROM users WHERE id = ${id}
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Delete Candidate API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, 500);
  }
}
