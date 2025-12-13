import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  // Note: PrismaAdapter is not needed when using Credentials Provider
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Allow a configured fallback admin account for cases where the DB is not reachable/seeded
        const envAdminEmail =
          process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
          process.env.ADMIN_EMAIL ||
          'admin@gemilike.com';
        const envAdminPassword =
          process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
          process.env.ADMIN_PASSWORD ||
          'admin123';
        const envAdminMatches =
          credentials.email === envAdminEmail &&
          credentials.password === envAdminPassword;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            if (envAdminMatches) {
              return {
                id: 'env-admin',
                email: envAdminEmail,
                name: 'Admin User',
                role: 'ADMIN',
              };
            }
            return null;
          }

          if (!user.password) {
            return envAdminMatches
              ? {
                  id: user.id,
                  email: envAdminEmail,
                  name: user.name ?? 'Admin User',
                  role: user.role ?? 'ADMIN',
                }
              : null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            if (!envAdminMatches) {
              return null;
            }
            return {
              id: user.id,
              email: envAdminEmail,
              name: user.name ?? 'Admin User',
              role: user.role ?? 'ADMIN',
            };
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('NextAuth authorize error:', error);
          if (envAdminMatches) {
            return {
              id: 'env-admin-fallback',
              email: envAdminEmail,
              name: 'Admin User',
              role: 'ADMIN',
            };
          }
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? null;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.sub === 'string' ? token.sub : session.user.id;
        session.user.role = typeof token.role === 'string' ? token.role : session.user.role ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/de/admin/login',
    error: '/de/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-change-in-production',
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
