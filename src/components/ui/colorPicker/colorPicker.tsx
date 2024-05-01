'use client'

import { forwardRef, useMemo } from 'react'
import cn from 'classnames'
import { Button } from '@radix-ui/themes'
import {
  Root,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@radix-ui/react-tabs'
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
} from 'react-hook-form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover'

import { Tooltip } from '../tooltip/tooltip'
import { ScrollArea } from '../scrollArea/scrollArea'
import styles from './styles.module.sass'
import SOLID_COLORS from './mockColors'
import MOCK_GRADIENT from './mockGradients'

type TColorPicker = FieldValues &
  FieldErrors & {
    fieldState: ControllerFieldState
    field: ControllerRenderProps
  }

export const ColorPicker = forwardRef<HTMLDivElement, TColorPicker>(
  ({ field }, ref) => {
    const { value, onChange, name } = field
    const background = useMemo(() => value, [value])

    return (
      <div className={styles.main} style={{ background: value }}>
        <GradientPicker background={background} setBackground={onChange} />
      </div>
    )
  }
)

ColorPicker.displayName = 'Color Picker'

export function GradientPicker({
  background,
  setBackground,
  className,
}: {
  background: string
  setBackground: (background: string) => void
  className?: string
}) {
  const images = [
    'url(https://images.unsplash.com/photo-1691200099282-16fd34790ade?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)',
    'url(https://images.unsplash.com/photo-1691226099773-b13a89a1d167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90',
    'url(https://images.unsplash.com/photo-1688822863426-8c5f9b257090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)',
    'url(https://images.unsplash.com/photo-1691225850735-6e4e51834cad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)',
  ]

  const defaultTab = useMemo(() => {
    if (background.includes('url')) return 'image'
    if (background.includes('gradient')) return 'gradient'
    return 'solid'
  }, [background])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            styles.btn,
            !background && 'text-muted-foreground',
            className
          )}
        >
          <Tooltip decsription="Choose color tip">
            <div className={styles.color_wrapper}>
              <div
                className={styles.color_preview}
                style={{ background }}
              ></div>
            </div>
          </Tooltip>
        </Button>
      </PopoverTrigger>

      <PopoverContent className={styles.container} style={{ zIndex: 1 }}>
        <Root className={styles.wrapper} defaultValue={defaultTab}>
          <Tabs defaultValue={defaultTab} className={styles.tabs}>
            <TabsList className={cn(styles.tabs_list)}>
              <TabsTrigger
                style={{ width: 'calc(50% - 3px)' }}
                className={styles.tabs_item}
                value="solid"
              >
                Solid
              </TabsTrigger>
              <TabsTrigger
                style={{ width: 'calc(50% - 3px)' }}
                className={styles.tabs_item}
                value="gradient"
              >
                Gradient
              </TabsTrigger>
            </TabsList>

            <ScrollArea type={'always'}>
              <>
                <TabsContent value="solid" className={styles.list_content}>
                  {SOLID_COLORS.map((s) => (
                    <div
                      key={s}
                      style={{ background: s }}
                      className={styles.cube}
                      onClick={() => setBackground(s)}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="gradient" className={styles.list_content}>
                  {MOCK_GRADIENT.map((s) => (
                    <div
                      key={s}
                      className={styles.cube}
                      style={{ background: s }}
                      onClick={() => setBackground(s)}
                    />
                  ))}
                </TabsContent>
              </>
            </ScrollArea>
          </Tabs>
        </Root>
      </PopoverContent>
    </Popover>
  )
}
