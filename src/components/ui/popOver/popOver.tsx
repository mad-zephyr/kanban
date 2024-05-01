import React, { FC, ReactElement } from 'react'
import {
  Arrow,
  Close,
  Content,
  PopoverContentProps,
  PopoverProps,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-popover'
import { Cross2Icon } from '@radix-ui/react-icons'
import './styles.sass'

type TPopover = PopoverProps &
  PopoverContentProps & {
    children: ReactElement
    triger: ReactElement
  }

export const Popover: FC<TPopover> = ({ children, triger }) => (
  <Root>
    <Trigger asChild>{triger}</Trigger>
    <Portal>
      <Content className="PopoverContent" sideOffset={5}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {children}
        </div>
        <Close className="PopoverClose" aria-label="Close">
          <Cross2Icon />
        </Close>
        <Arrow className="PopoverArrow" />
      </Content>
    </Portal>
  </Root>
)

Popover
