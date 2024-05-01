import React, { forwardRef, InputHTMLAttributes } from 'react'
import { Indicator, Root } from '@radix-ui/react-checkbox'
import { CheckIcon } from '@radix-ui/react-icons'
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
} from 'react-hook-form'
import cn from 'classnames'

import styles from './style.module.sass'

type TCheckbox = InputHTMLAttributes<HTMLInputElement> &
  FieldValues &
  FieldErrors & {
    label?: string
    fieldState: ControllerFieldState
    field: ControllerRenderProps
  }

export const Checkbox = forwardRef<HTMLInputElement, TCheckbox>(
  (props, ref) => {
    const { label, style, fieldState, field, className } = props
    const { name, value } = field

    const hasError = !!fieldState?.error && !!fieldState?.isTouched

    return (
      <label
        style={style}
        className={cn(styles.container, className)}
        htmlFor={name}
      >
        <span className={styles.Label}>
          <Root
            id={name}
            value={value}
            defaultChecked={field.value}
            onCheckedChange={field.onChange}
            className={styles.CheckboxRoot}
          >
            <Indicator className={styles.CheckboxIndicator}>
              <CheckIcon />
            </Indicator>
          </Root>

          {label && <div className={styles.text}>{label}</div>}
        </span>
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
