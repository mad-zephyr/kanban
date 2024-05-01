import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
} from 'react-hook-form'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import cn from 'classnames'
import type {
  SelectContentProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectTriggerProps,
  SelectValueProps,
} from '@radix-ui/react-select'
import {
  Content,
  Group,
  Icon,
  Item,
  ItemText,
  Root,
  Trigger,
  Value,
  Viewport,
} from '@radix-ui/react-select'
import { forwardRef, SelectHTMLAttributes } from 'react'

import styles from './styles.module.sass'

type AllSelectProps = SelectTriggerProps &
  SelectLabelProps &
  SelectValueProps &
  SelectGroupProps &
  SelectContentProps

type TSelect = AllSelectProps &
  SelectHTMLAttributes<HTMLSelectElement> &
  FieldValues &
  FieldErrors & {
    label?: string
    fieldState: ControllerFieldState
    field: ControllerRenderProps
    defaultValue?: string
    options: { id: string; name: string }[]
    value: string
  }

export const Select = forwardRef<HTMLSelectElement, TSelect>((props, _reff) => {
  const { defaultValue, style, field, label, fieldState, options = [] } = props
  const { name, onChange, value, ref } = field
  const { error } = fieldState

  const hasError = !!error?.message

  const currentOption = options.find((option) => option.id === value)

  const handleChange = (value: string) => {
    onChange(value)
  }

  return (
    <fieldset
      ref={ref}
      className={cn(styles.Select, { [styles.error]: hasError })}
      style={style}
    >
      {label && <label htmlFor={name}>{label}</label>}
      <Root
        value={currentOption?.id}
        defaultValue={defaultValue}
        onValueChange={handleChange}
        disabled={field.disabled}
      >
        <Trigger className={styles.SelectTrigger} aria-label="options">
          <Value>{currentOption?.name}</Value>
          <Icon className={styles.SelectIcon}>
            <ChevronDownIcon />
          </Icon>
        </Trigger>
        <Content
          className={styles.SelectContent}
          position="popper"
          sideOffset={4}
          style={{ width: '100%' }}
        >
          <Viewport>
            <Group>
              {options.map((option) => (
                <Item
                  key={option.id}
                  className={styles.SelectItem}
                  value={option.id}
                >
                  <ItemText>{option.name}</ItemText>
                </Item>
              ))}
            </Group>
          </Viewport>
        </Content>
      </Root>
    </fieldset>
  )
})

Select.displayName = 'Select'
