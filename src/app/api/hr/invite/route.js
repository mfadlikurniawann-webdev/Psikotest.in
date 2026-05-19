import sql from '@/lib/db';
import { verifyToken, hashPassword } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const token = cookies().get('auth_token')?.value;
    const user = await verifyToken(token);
    if (!user || user.role !== 'hr') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, position_applied, password } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Nama dan email wajib diisi' }, { status: 400 });
    }

    // Check if email already exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Alamat email sudah terdaftar' }, { status: 400 });
    }

    // Determine password
    const plainPassword = password || Math.random().toString(36).substring(2, 10);
    const hashedPassword = await hashPassword(plainPassword);

    await sql`
      INSERT INTO users (name, email, password, role, position_applied, is_active, created_at, updated_at)
      VALUES (${name}, ${email}, ${hashedPassword}, 'candidate', ${position_applied || null}, true, NOW(), NOW())
    `;

    return NextResponse.json({
      ok: true,
      message: `Akun kandidat ${name} berhasil dibuat!`,
      email,
      password: plainPassword
    });
  } catch (err) {
    console.error('Invite Candidate API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
