import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'E-mail', type: 'text', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password', placeholder: 'password' },
      },
      async authorize(credentials) {
        let user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (user) {
          const validPassword = await bcrypt.compare(credentials.password, user.password);
          user.password = undefined;
          user.assignedAt = undefined;
          return validPassword ? user : null;
        } else {
          logger.info({ event: 'signInAttempt', username: credentials.username });
          return null;
        }
      },
    }),
  ],
  events: {
    async signIn({ user, isNewUser }) {
      logger.info({ event: 'signIn', user, isNewUser });
      // Return false to display a default error message
      return user.isDisabled;
    },
    async signOut(message) {
      logger.info({ event: 'signOut', session: message.session });
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      // `token` is being send below to `session` callback.
      user && (token.user = user);

      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 9 * 24 * 60 * 60, // 9 days
    updateAge: 9 * 60 * 60, // 9 hours
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
