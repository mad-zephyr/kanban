import { z } from 'zod'

export const LoginAuthFormSchema = z.object({
  email: z.string().trim().email('Should be a valid email'),
  password: z.string(),
})

export type LoginAuthFormSchemaType = z.infer<typeof LoginAuthFormSchema>
