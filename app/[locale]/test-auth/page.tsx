'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function TestAuthPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold mb-4">Test Auth - Angemeldet</h1>
        <p>Willkommen, {session.user?.email}!</p>
        <button
          onClick={() => signOut()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Abmelden
        </button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-4">Test Auth - Nicht angemeldet</h1>
      <button
        onClick={() => signIn('credentials', { 
          email: 'test@example.com', 
          password: 'password' 
        })}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Login
      </button>
    </div>
  );
}
