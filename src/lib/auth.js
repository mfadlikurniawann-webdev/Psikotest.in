import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { verifyToken } from './auth-edge';
export { signToken, verifyToken } from './auth-edge';

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

export async function getCurrentUser() {
  try {
    const token = cookies().get('auth_token')?.value;
    return await verifyToken(token);
  } catch (e) {
    return null;
  }
}
