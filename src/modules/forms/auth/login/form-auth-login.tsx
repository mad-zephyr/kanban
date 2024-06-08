'use client'

import { FC, useEffect, useState, useTransition } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@radix-ui/themes'
import cn from 'classnames'
import { usePathname } from 'next/navigation'

import { Callout, Input } from '@/components/ui'
import { login } from '@/actions/login'
import {
  LoginAuthFormSchema,
  LoginAuthFormSchemaType,
} from '@/common/schemas/login'

import styles from './style.module.sass'

type TLoginAuthForm = {
  onClose: () => void
}

const DEFAULT_AUTH_DATA = {
  email: '',
  password: '',
}

const LoginAuthForm: FC<TLoginAuthForm> = ({ onClose }) => {
  const pathName = usePathname()
  const [isFormSubmiting, startSubmiting] = useTransition()
  const [inputPassType, setInputPassType] = useState<'password' | ''>(
    'password'
  )

  const [formStatus, setFormStatus] = useState<{
    type?: 'error' | 'success'
    message?: string
  }>({})

  const showPassHandler = () => {
    setInputPassType((prevState) =>
      prevState === 'password' ? '' : 'password'
    )
  }

  const methods = useForm<LoginAuthFormSchemaType>({
    shouldFocusError: true,
    disabled: false,
    defaultValues: DEFAULT_AUTH_DATA,
    resolver: zodResolver(LoginAuthFormSchema),
  })

  const { handleSubmit, control } = methods

  const onSubmit: SubmitHandler<LoginAuthFormSchemaType> = (submitValues) => {
    setFormStatus({ type: 'success' })

    startSubmiting(async () => {
      const data = await login(submitValues)
      if (data?.type === 'error') {
        setFormStatus({ type: data?.type, message: data?.message })
      } else {
        onClose()
      }
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Input
            placeholder="e.g. name@domain.com"
            label="Your Email adress *"
            field={field}
            fieldState={fieldState}
            disabled={isFormSubmiting}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Input
            label="Password *"
            placeholder="Your password"
            field={field}
            fieldState={fieldState}
            type={inputPassType}
            showPass={true}
            onShowPass={showPassHandler}
            disabled={isFormSubmiting}
          />
        )}
      />

      {formStatus.message && (
        <Callout
          text={formStatus.message}
          color={formStatus.type === 'error' ? 'red' : 'green'}
          size={'1'}
          variant="outline"
        />
      )}

      <Button
        size={'3'}
        type={'submit'}
        className={cn(styles.btn, styles.btn_wide, styles.btn_primary)}
        disabled={isFormSubmiting}
      >
        Login
      </Button>
    </form>
  )
}

export default LoginAuthForm
