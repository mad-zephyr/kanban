'use client'

import { FC, useState } from 'react'
import { IconButton } from '@radix-ui/themes'
import { EnterIcon, PersonIcon } from '@radix-ui/react-icons'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Avatar, DropDown, DropDownItem } from '@/components/ui'
import Modal from '@/components/ui/modal/modal'
import { useCurrentSession } from '@/common/hooks/useCurrentSession'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

import styles from './styles.module.sass'
import SignupAuthForm from '../forms/auth/signup/form-auth-signup'
import LoginAuthForm from '../forms/auth/login/form-auth-login'

const BASE_IMG =
  'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80'

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

  const handleAuthState = () => {
    setAuthFormState((prevState) =>
      prevState === 'login' ? 'signup' : 'login'
    )
  }

  return (
    <div ref={setDropDownContainer} datatype="auth_btn" className={styles.main}>
      {user ? (
        <DropDown
          withArrow
          className={styles.dropDown}
          container={dropDownContainer}
          triger={
            user.image && user.name ? (
              <Avatar
                fallback={user.name}
                name={user.name}
                image={user.image}
              />
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
