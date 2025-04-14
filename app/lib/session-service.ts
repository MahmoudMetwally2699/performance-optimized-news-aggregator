import { cookies } from 'next/headers';
import { verifyToken } from './auth';

export async function getSession() {
  const cookiesList = await cookies().getAll();
  const authToken = cookiesList.find(cookie => cookie.name === 'auth_token');
  if (!authToken?.value) return null;
  return verifyToken(authToken.value);
}
