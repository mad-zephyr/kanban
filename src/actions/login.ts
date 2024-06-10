'use server'

import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import {
  LoginAuthFormSchema,
  LoginAuthFormSchemaType,
} from '@/common/schemas/login'
import { generateVerificationToken } from '@/lib/tokens'
import { getUserByEmail } from '@/data/user'
import { sendVerificationMail } from '@/lib/mail'

export const login = async (
  values: LoginAuthFormSchemaType
): Promise<{ type: 'error' | 'success'; message: string }> => {
  const MSG_WRONG_CREDENTIALS = 'Wrong credentials'

  const validatedFields = LoginAuthFormSchema.safeParse(values)

  if (!validatedFields.success) {
    return { type: 'error', message: MSG_WRONG_CREDENTIALS }
  }

  const { email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { type: 'error', message: MSG_WRONG_CREDENTIALS }
  }

  if (!existingUser?.emailVerified) {
    const createdVerificationToken = await generateVerificationToken(
      existingUser.email
    )

    if (createdVerificationToken) {
      await sendVerificationMail(
        existingUser.email,
        createdVerificationToken.token
      )
    }

    return {
      type: 'success',
      message: 'Please check email & confirm your email',
    }
  }

  try {
    const redirectUrl = await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })

    if (redirectUrl) {
      goToPage()
      return { type: 'success', message: 'Welcome back' }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return {
            type: 'error',
            message: 'Wrong credentials or user doesn`t exist',
          }
        }
        default: {
          return { type: 'error', message: 'Something goes wrong' }
        }
      }
    }
    throw error
  }

  return { type: 'success', message: 'Welcome back' }
}

function goToPage() {
  console.log('DEFAULT_LOGIN_REDIRECT: ', DEFAULT_LOGIN_REDIRECT)
  redirect(DEFAULT_LOGIN_REDIRECT)
}
