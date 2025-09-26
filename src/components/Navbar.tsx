'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Arqui ASM</Link>
        <div className="flex items-center space-x-4">
          <Link href="/exercises" className="hover:text-gray-300">Ejercicios</Link>
          {(session?.user as any)?.isAdmin && (
            <Link href="/admin" className="hover:text-gray-300">Admin</Link>
          )}
          {status === 'loading' ? (
            <span>Cargando...</span>
          ) : session ? (
            <div className="flex items-center space-x-2">
              <span>{session.user?.email}</span>
              <button 
                onClick={() => signOut()} 
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                Iniciar sesión
              </Link>
              <Link href="/register" className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
