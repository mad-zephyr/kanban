'use server'

import bcrypt from 'bcryptjs'

import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'
import { SignupAuthFormSchemaType } from '@/common/schemas/register'

const registerUser = async (
  values: SignupAuthFormSchemaType
): Promise<{ type: 'error' | 'success'; message: string }> => {
  const { email, name, password } = values

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { type: 'error', message: 'This Email already registered' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await db.user.create({
    data: { email, name, password: hashedPassword },
  })

  // TODO: send verification token email

  if (!user) {
    return { type: 'error', message: 'Something goes wrong' }
  }

  return { type: 'success', message: 'User registered, move to login page' }
}

export default registerUser
