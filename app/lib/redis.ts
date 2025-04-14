import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function getCachedData<T>(key: string): Promise<T | null> {
  return redis.get(key);
}

export async function setCachedData<T>(key: string, data: T, expireIn = 300): Promise<void> {
  await redis.set(key, data, { ex: expireIn });
}
