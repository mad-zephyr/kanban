import { z } from 'zod'

export const SignupAuthFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(4, { message: 'The name must consist of at least 4 letters' }),
    email: z.string().trim().email('Should be a valid email'),
    password: z
      .string()
      .min(6, 'Password must contain at least 6 characters')
      .regex(/[A-Z]/, 'Password must contain at least one capital letter')
      .regex(/[0-9]/, 'The password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one character'),
    repassword: z
      .string()
      .trim()
      .min(4, { message: 'The name must consist of at least 4 letters' }),
  })
  .refine(({ password, repassword }) => password === repassword, {
    message: 'Пароли не совпадают',
    path: ['repassword'],
  })

export type SignupAuthFormSchemaType = z.infer<typeof SignupAuthFormSchema>
