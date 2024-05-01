import * as ToolTip from '@radix-ui/react-tooltip'
import { FC, HTMLAttributes, ReactElement } from 'react'

import './styles.sass'
import { ThemeProvider } from '@/providers/theme.provider'

type TToolTip = HTMLAttributes<HTMLElement> &
  ToolTip.TooltipContentProps & {
    children: ReactElement
    decsription?: string
  }

export const Tooltip: FC<TToolTip> = ({ children, decsription, side }) => {
  return (
    <ToolTip.Provider>
      <ToolTip.Root>
        <ToolTip.Trigger asChild>{children}</ToolTip.Trigger>
        <ToolTip.Portal>
          <ToolTip.Content
            side={side}
            className="TooltipContent"
            sideOffset={5}
          >
            {decsription}
            <ToolTip.Arrow className="TooltipArrow" />
          </ToolTip.Content>
        </ToolTip.Portal>
      </ToolTip.Root>
    </ToolTip.Provider>
  )
}
