import cn from 'classnames'
import { Component, forwardRef } from 'react'
import { CrossCircledIcon } from '@radix-ui/react-icons'

import styles from './style.module.sass'
import { TInput } from './inpit.props'
import { Tooltip } from '../tooltip/tooltip'

export const Input = forwardRef<HTMLInputElement, TInput>((props, ref) => {
  const { label, style, fieldState, field, postfix, prefix } = props
  const { name, value } = field

  const hasError = !!fieldState?.error && !!fieldState?.isTouched

  return (
    <fieldset
      className={cn(styles.fieldset, { [styles.error]: hasError })}
      style={style}
    >
      {label && <label htmlFor={name}>{label}</label>}

      <span className={styles.input_wrapper}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <span
          className={cn(styles.input_container, {
            [styles.with_prefix]: !!prefix,
            [styles.with_postfix]: !!postfix,
            [styles.with_prefix_postfix]: !!prefix && !!postfix,
          })}
        >
          <input id={name} {...field} value={value} />
          {hasError && (
            <Tooltip decsription={fieldState?.error?.message} side="left">
              <div className={styles.error_container}>
                <CrossCircledIcon className={styles.error_icon} />
              </div>
            </Tooltip>
          )}
        </span>
        <span className={styles.postfix}>{postfix}</span>
      </span>
    </fieldset>
  )
})

Input.displayName = 'input'
