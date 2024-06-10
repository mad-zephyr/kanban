import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationMail = async (email: string, token: string) => {
  const host =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_PROD
      : process.env.NEXT_PUBLIC_API_DEV

  const confirmLink = `${host}/auth/new-verification?token=${token}`

  await resend.emails.send({
    from: 'onboarding@kanban.xrace.one',
    to: email,
    subject: 'Verification mail',
    html: `<p>To verify your email, please folow the link <a href="${confirmLink}">Confirmation link</a> </p>`,
  })
}
