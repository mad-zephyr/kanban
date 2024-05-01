import React, { FC, ReactElement } from 'react'
import * as Scroll from '@radix-ui/react-scroll-area'
import './styles.sass'
import cn from 'classnames'

type TScrollArea = Scroll.ScrollAreaProps & {
  children: ReactElement
}

export const ScrollArea: FC<TScrollArea> = ({ children, type, className }) => (
  <Scroll.Root type={type} className="ScrollAreaRoot">
    <Scroll.Viewport className={cn('ScrollAreaViewport', className)}>
      {children}
    </Scroll.Viewport>
    <Scroll.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
      <Scroll.Thumb className="ScrollAreaThumb" />
    </Scroll.Scrollbar>
    <Scroll.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
      <Scroll.Thumb className="ScrollAreaThumb" />
    </Scroll.Scrollbar>
    <Scroll.Corner className="ScrollAreaCorner" />
  </Scroll.Root>
)
