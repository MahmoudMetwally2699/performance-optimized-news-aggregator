import { cookies } from 'next/headers';
import { verifyToken } from './auth';

export async function getSession() {
  const cookiesList = (await cookies()).getAll();
const authToken: { name: string; value: string } | undefined = cookiesList.find((cookie): cookie is { name: string; value: string } => cookie.name === 'auth_token');
  if (!authToken?.value) return null;
  return verifyToken(authToken.value);
}
