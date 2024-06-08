import cn from 'classnames'
import { forwardRef } from 'react'

import styles from './style.module.sass'
import { TInput } from './inpit.props'
import { PassIconEye } from './components/input-showpass-icon'

export const Input = forwardRef<HTMLInputElement, TInput>((props, ref) => {
  const {
    label,
    style,
    fieldState,
    field,
    postfix,
    prefix,
    placeholder,
    showPass,
    onShowPass,
    ...rest
  } = props
  const { name, value } = field
  const { type } = rest

  const hasError = !!fieldState?.error && !!fieldState?.isTouched

  const passIcon = showPass ? (
    <PassIconEye onClick={onShowPass} className={styles.passIcon} type={type} />
  ) : (
    <></>
  )

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
            [styles.with_prefix]: Boolean(prefix),
            [styles.with_postfix]: Boolean(postfix),
            [styles.with_prefix_postfix]: Boolean(prefix) && Boolean(postfix),
          })}
        >
          <span className={styles.input_content}>
            <input
              id={name}
              {...field}
              value={value}
              placeholder={placeholder}
              {...rest}
            />
            {passIcon}
            {hasError && (
              <div className={styles.error_label}>
                {fieldState?.error?.message}
              </div>
            )}
          </span>
        </span>
        {postfix && <span className={styles.postfix}>{postfix}</span>}
      </span>
    </fieldset>
  )
})

Input.displayName = 'input'
