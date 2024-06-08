import { User } from '@prisma/client'

import { db } from '@/lib/db'

const getUserByEmail = async (email: string) => {
  try {
    return await db.user.findUnique({
      where: {
        email,
      },
    })
  } catch (e) {
    return null
  }
}

const getUserById = async (id?: string) => {
  try {
    return await db.user.findUnique({
      where: {
        id,
      },
    })
  } catch (e) {
    return null
  }
}

const createUser = async ({
  email,
  name,
  hashedPassword,
}: {
  email: string
  name: string
  hashedPassword: string
}) =>
  db.user.create({
    data: { email: email, name, password: hashedPassword },
  })

export { getUserByEmail, getUserById }
