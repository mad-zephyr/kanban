import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import authConfig from '@/auth.config'

import { db } from './lib/db'
import { getUserById } from './data/user'

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/',
    error: '/',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      console.log({ user, account })
      // Allow OAuth without email verification
      if (account?.type !== 'credentials') {
        return true
      }

      const existingUser = await getUserById(user.id)

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) {
        return false
      }

      // TODO: Add 2FA check

      return true
    },

    session: async ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role
      }

      return session
    },
    jwt: async ({ token }) => {
      if (!token?.sub) {
        return token
      }
      const existingUser = await getUserById(token.sub)

      if (!existingUser) {
        return token
      }
      token.role = existingUser.role

      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})
