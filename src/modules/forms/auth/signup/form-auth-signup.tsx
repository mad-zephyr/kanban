'use client'

import { FC, useState, useTransition } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@radix-ui/themes'
import cn from 'classnames'

import { Callout, Input } from '@/components/ui'
import register from '@/actions/register'
import {
  SignupAuthFormSchema,
  SignupAuthFormSchemaType,
} from '@/common/schemas/register'

import styles from './style.module.sass'

type TSignupAuthForm = {
  onClose: () => void
}

const DEFAULT_AUTH_DATA = {
  name: '',
  email: '',
  password: '',
  repassword: '',
}

const SignupAuthForm: FC<TSignupAuthForm> = ({ onClose }) => {
  const [isFormSubmited, startTransition] = useTransition()
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

  const methods = useForm<SignupAuthFormSchemaType>({
    shouldFocusError: true,
    disabled: false,
    defaultValues: DEFAULT_AUTH_DATA,
    resolver: zodResolver(SignupAuthFormSchema),
  })

  const { handleSubmit, control } = methods

  const onSubmit: SubmitHandler<SignupAuthFormSchemaType> = (submitValues) => {
    setFormStatus({ type: 'success' })

    startTransition(async () => {
      const data = await register(submitValues)

      setFormStatus({ type: data.type, message: data.message })
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Input
            placeholder="e.g. Jhon Smith"
            label="Name *"
            field={field}
            fieldState={fieldState}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Input
            placeholder="e.g. name@domain.com"
            label="Email adress *"
            field={field}
            fieldState={fieldState}
            disabled={isFormSubmited}
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
            placeholder="Create password"
            field={field}
            fieldState={fieldState}
            type={inputPassType}
            showPass={true}
            onShowPass={showPassHandler}
            disabled={isFormSubmited}
          />
        )}
      />
      <Controller
        name="repassword"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Input
            type={inputPassType}
            label="Repeat password *"
            placeholder="Repeat password"
            field={field}
            fieldState={fieldState}
            showPass={true}
            onShowPass={showPassHandler}
            disabled={isFormSubmited}
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
        disabled={isFormSubmited}
      >
        Create an account
      </Button>
    </form>
  )
}

export default SignupAuthForm
