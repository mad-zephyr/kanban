import { TextArea } from '@radix-ui/themes'
import { forwardRef } from 'react'
import cn from 'classnames'
import { CrossCircledIcon } from '@radix-ui/react-icons'

import type { TTextarea } from './textarea.props'
import styles from './styles.module.sass'
import { Tooltip } from '../tooltip/tooltip'

export const Textarea = forwardRef<HTMLTextAreaElement, TTextarea>(
  (props, ref) => {
    const { label, style, fieldState, field, postfix, prefix, placeholder } =
      props
    const { name } = field

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
            <TextArea
              id={name}
              size="1"
              placeholder={placeholder}
              {...field}
              resize={'vertical'}
            />
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
  }
)

Textarea.displayName = 'Textarea'
