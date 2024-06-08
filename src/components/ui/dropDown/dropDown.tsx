import {
  Arrow,
  Content,
  Item,
  Portal,
  Root,
  Separator,
  Trigger,
} from '@radix-ui/react-dropdown-menu'
import type { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu'
import { FC, forwardRef, ReactElement } from 'react'
import cn from 'classnames'

import './styles.sass'

type TDropDown = {
  className?: string
  triger?: ReactElement
  content?: ReactElement
  container?: HTMLElement | null
  withArrow?: boolean
  drowDownProps?: DropdownMenuContentProps
}

export const DropDown = forwardRef<HTMLDivElement, TDropDown>(
  (
    { className, triger, content, container, withArrow = false, drowDownProps },
    ref
  ) => {
    return (
      <div className={className} ref={ref}>
        <Root>
          <Trigger asChild>{triger}</Trigger>

          <Portal container={container}>
            <Content
              className="DropdownMenuContent"
              sideOffset={drowDownProps?.sideOffset || 22}
              collisionPadding={{ right: 40 }}
            >
              {content}
              {withArrow && <Arrow className="DropdownMenuArrow" />}
            </Content>
          </Portal>
        </Root>
      </div>
    )
  }
)

type TDropDownItem = {
  onClick: () => void
  text: string
}

export const DropDownItem: FC<TDropDownItem> = ({ onClick, text }) => {
  return (
    <Item onClick={onClick} className={cn('DropdownMenuItem')}>
      {text}
    </Item>
  )
}

export const DropDownSeparator = () => {
  return <Separator />
}

DropDown.displayName = 'DropDown'
