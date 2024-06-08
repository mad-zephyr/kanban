import { DetailedHTMLProps, InputHTMLAttributes, ReactElement } from 'react'
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
} from 'react-hook-form'

export type TInput = FieldValues &
  FieldErrors &
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    label?: string
    fieldState: ControllerFieldState
    field: ControllerRenderProps
    postfix?: ReactElement
    prefix?: ReactElement
    onShowPass?: () => void
  }
