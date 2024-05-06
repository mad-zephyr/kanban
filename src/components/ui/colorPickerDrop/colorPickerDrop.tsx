'use client'

import { forwardRef, useMemo } from 'react'
import cn from 'classnames'
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
  Arrow,
  Content,
  Portal,
  Root as RootDropdown,
  Trigger,
} from '@radix-ui/react-dropdown-menu'

import { Tooltip } from '../tooltip/tooltip'
import { ScrollArea } from '../scrollArea/scrollArea'
import styles from './styles.module.sass'
import SOLID_COLORS from './mockColors'
import MOCK_GRADIENT from './mockGradients'

type TColorPicker = FieldValues &
  FieldErrors & {
    fieldState: ControllerFieldState
    field: ControllerRenderProps
    container?: HTMLElement | null
  }

export const ColorPickerDrop = forwardRef<HTMLDivElement, TColorPicker>(
  ({ field, className, container }, ref) => {
    const { value, onChange, name } = field
    const background = useMemo(() => value, [value])

    const defaultTab = useMemo(() => {
      if (background.includes('url')) return 'image'
      if (background.includes('gradient')) return 'gradient'
      return 'solid'
    }, [background])

    return (
      <div>
        <RootDropdown>
          <Trigger asChild>
            <div role="button" className={cn(styles.btn, className)}>
              <Tooltip decsription="Choose color tip">
                <div className={styles.color_wrapper}>
                  <div
                    className={styles.color_preview}
                    style={{ background }}
                  />
                </div>
              </Tooltip>
            </div>
          </Trigger>
          <Portal container={container}>
            <Content className={styles.container} defaultValue={defaultTab}>
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
                          onClick={() => onChange(s)}
                        />
                      ))}
                    </TabsContent>

                    <TabsContent
                      value="gradient"
                      className={styles.list_content}
                    >
                      {MOCK_GRADIENT.map((s) => (
                        <div
                          key={s}
                          className={styles.cube}
                          style={{ background: s }}
                          onClick={() => onChange(s)}
                        />
                      ))}
                    </TabsContent>
                  </>
                </ScrollArea>
              </Tabs>
              <Arrow className={styles.PopoverArrow} />
            </Content>
          </Portal>
        </RootDropdown>
      </div>
    )
  }
)

ColorPickerDrop.displayName = 'Color Picker Drop'
