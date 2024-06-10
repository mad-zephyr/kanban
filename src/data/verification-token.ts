import { type VerificationToken } from '@prisma/client'

import { db } from '@/lib/db'

export const verificationToken = {
  create: async (
    email: string,
    token: string,
    expires: Date
  ): Promise<VerificationToken | null> => {
    try {
      const createdToken = await db.verificationToken.create({
        data: {
          email,
          token,
          expires,
        },
      })
      return createdToken
    } catch (error) {
      console.error('ERROR CREATE VERIFICATION TOKEN: ', error)
      return null
    }
  },

  delete: async (tokenId: string) => {
    try {
      const deleted = await db.verificationToken.delete({
        where: { id: tokenId },
      })
      return !!deleted
    } catch (error) {
      return false
    }
  },

  getByToken: async (token: string) => {
    try {
      return await db.verificationToken.findUnique({
        where: { token },
      })
    } catch (error) {
      return null
    }
  },

  getByEmail: async (email: string) => {
    try {
      return await db.verificationToken.findFirst({
        where: { email },
      })
    } catch (error) {
      return null
    }
  },
}
