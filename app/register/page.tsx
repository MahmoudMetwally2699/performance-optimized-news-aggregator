'use client';

import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await register(
        formData.get('email') as string,
        formData.get('password') as string,
        formData.get('name') as string
      );
      router.push('/');
    } catch (err) {
      setError('Registration failed');
    }
  }

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <label htmlFor="name" className="block mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-foreground text-background rounded"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <Link href="/login" className="underline">Login</Link>
      </p>
    </div>
  );
}
