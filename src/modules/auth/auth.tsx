'use client'

import { FC, Suspense, useEffect, useState } from 'react'
import { IconButton } from '@radix-ui/themes'
import { EnterIcon, PersonIcon } from '@radix-ui/react-icons'
import { signOut } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Avatar, DropDown, DropDownItem, useToast } from '@/components/ui'
import Modal from '@/components/ui/modal/modal'
import { useCurrentSession } from '@/common/hooks/useCurrentSession'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { TToast } from '@/components/ui/toaster/components'

import styles from './styles.module.sass'
import SignupAuthForm from '../forms/auth/signup/form-auth-signup'
import LoginAuthForm from '../forms/auth/login/form-auth-login'

const BASE_IMG =
  'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80'

const BASE_TOAST: TToast = {
  type: 'background',
  description:
    'This web app utilizes `localStorage` to store your data. Please log in to access your data across devices.',
  title: 'HI THERE!!',
  status: 'default',
}

const FORM_TEXT = {
  login: {
    formTitle: 'Login',
    submitBtn: 'Login',
    changeForm: 'New user, create new account?',
  },
  signup: {
    formTitle: '🔐 Register new user',
    submitBtn: 'Sign up',
    changeForm: 'Already have account?',
  },
}

export const AuthModule: FC = () => {
  const searchParams = useSearchParams()
  const { push } = useRouter()
  const [dropDownContainer, setDropDownContainer] =
    useState<HTMLElement | null>(null)
  const [isShowAuthModal, setIsShowAuthModal] = useState(false)
  const [authFormState, setAuthFormState] = useState<'login' | 'signup'>(
    'login'
  )
  const { formTitle, changeForm } = FORM_TEXT[authFormState]

  const { session } = useCurrentSession()
  const user = session?.user

  const handleShowAuthModal = () => {
    setIsShowAuthModal((prev) => !prev)
  }

  useEffect(() => {
    if (searchParams.get('error') === 'OAuthAccountNotLinked') {
      setIsShowAuthModal(true)
    }
  }, [searchParams])

  const { base } = useToast()

  useEffect(() => {
    if (!user) {
      base(BASE_TOAST)
    } else {
      base({
        type: 'foreground',
        status: 'default',
        title: `WELCOME BACK ${user.name}!!`,
        description: ``,
      })
    }
  }, [base, user])

  const handleAuthState = () => {
    setAuthFormState((prevState) =>
      prevState === 'login' ? 'signup' : 'login'
    )
  }

  return (
    <div ref={setDropDownContainer} className={styles.main}>
      {user ? (
        <DropDown
          withArrow={false}
          className={styles.dropDown}
          container={dropDownContainer}
          triger={
            user.image && user.name ? (
              <button>
                <Avatar
                  fallback={userNameShortning(user.name)}
                  name={userNameShortning(user.name)}
                  image={user.image}
                />
              </button>
            ) : (
              <IconButton variant="ghost" size={'4'}>
                <PersonIcon />
              </IconButton>
            )
          }
          content={
            <>
              <DropDownItem
                onClick={() => push(DEFAULT_LOGIN_REDIRECT)}
                text={'Settings'}
              />
              <DropDownItem onClick={signOut} text={'Logout'} />
            </>
          }
        />
      ) : (
        <IconButton
          className={styles.loginBtn}
          variant="ghost"
          size={'4'}
          onClick={handleShowAuthModal}
        >
          <EnterIcon />
        </IconButton>
      )}
      <Modal
        isOpen={isShowAuthModal}
        title={formTitle}
        onOpenChange={handleShowAuthModal}
      >
        <>
          {authFormState === 'signup' ? (
            <SignupAuthForm onClose={handleShowAuthModal} />
          ) : (
            <LoginAuthForm onClose={handleShowAuthModal} />
          )}

          <div onClick={handleAuthState} className={styles.login}>
            {changeForm}
          </div>
        </>
      </Modal>
    </div>
  )
}

function userNameShortning(name: string) {
  return name
    ? name
        .split(' ')
        .map((namePart) => namePart[0])
        .join('')
    : 'UN'
}
