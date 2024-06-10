import { FC } from 'react'
import { Button } from '@radix-ui/themes'
import { signIn } from 'next-auth/react'

import GoogleIcon from '@/assets/google_logo_24px.svg'
import GitHubIcon from '@/assets/github_logo.svg'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

import styles from './style.module.sass'

export const SocialAuth: FC = () => {
  const authHandler = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
  }
  return (
    <div className={styles.group}>
      <Button variant="outline" onClick={() => authHandler('google')}>
        <GoogleIcon />
      </Button>
      <Button variant="outline" onClick={() => authHandler('github')}>
        <GitHubIcon />
      </Button>
    </div>
  )
}
