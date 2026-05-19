import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { hashPassword, comparePassword, signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // --- LOGOUT ---
    if (action === 'logout') {
      const response = NextResponse.json({ ok: true });
      response.cookies.set('auth_token', '', {
        path: '/',
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return response;
    }

    // --- LOGIN ---
    if (action === 'login') {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
      }

      // Find user
      const users = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
      if (users.length === 0) {
        return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
      }

      const user = users[0];
      if (!user.is_active) {
        return NextResponse.json({ error: 'Akun Anda dinonaktifkan' }, { status: 403 });
      }

      // Check password
      const isMatch = comparePassword(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
      }

      // Sign token
      const token = await signToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });

      const response = NextResponse.json({
        ok: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

      // Set cookie
      response.cookies.set('auth_token', token, {
        path: '/',
        httpOnly: true,
        maxAge: 86400, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;
    }

    // --- REGISTER ---
    if (action === 'register') {
      const { name, email, password, phone, position_applied, birth_date, education } = body;

      if (!name || !email || !password) {
        return NextResponse.json({ error: 'Nama, email, dan password wajib diisi' }, { status: 400 });
      }

      if (password.length < 8) {
        return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
      }

      // Check if email already exists
      const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
      if (existing.length > 0) {
        return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
      }

      // Hash password and insert
      const hashedPassword = hashPassword(password);
      const newUser = await sql`
        INSERT INTO users (name, email, password, role, phone, position_applied, birth_date, education, is_active)
        VALUES (${name}, ${email}, ${hashedPassword}, 'candidate', ${phone || null}, ${position_applied || null}, ${birth_date || null}, ${education || null}, true)
        RETURNING id, name, email, role
      `;

      const user = newUser[0];

      // Sign token
      const token = await signToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });

      const response = NextResponse.json({
        ok: true,
        user
      });

      // Set cookie
      response.cookies.set('auth_token', token, {
        path: '/',
        httpOnly: true,
        maxAge: 86400, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Auth API Error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
