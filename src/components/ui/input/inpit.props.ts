import { InputHTMLAttributes, ReactElement } from 'react'
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
} from 'react-hook-form'

export type TInput = InputHTMLAttributes<HTMLInputElement> &
  FieldValues &
  FieldErrors & {
    label?: string
    fieldState: ControllerFieldState
    field: ControllerRenderProps
    postfix?: ReactElement
    prefix?: ReactElement
  }
