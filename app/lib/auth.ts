import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  try {
    const store = await cookies();
    const token = store.get('auth_token');

    if (!token?.value) {
      return null;
    }

    return verifyToken(token.value);
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}
