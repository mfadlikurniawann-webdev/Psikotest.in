import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'psikotest-secret-key-32-characters-minimum-for-security'
);

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password, hash) {
  try {
    let normalizedHash = hash;
    if (hash && hash.startsWith('$2y$')) {
      normalizedHash = '$2a$' + hash.substring(4);
    }
    return bcrypt.compareSync(password, normalizedHash);
  } catch (e) {
    console.error('Password comparison error:', e);
    return false;
  }
}

export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const { cookies } = await import('next/headers');
    const token = cookies().get('auth_token')?.value;
    return await verifyToken(token);
  } catch (e) {
    return null;
  }
}
