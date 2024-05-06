import { type FC, useState } from 'react'
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Flex, IconButton } from '@radix-ui/themes'
import cn from 'classnames'
import { v4 as uuidv4 } from 'uuid'
import { Cross1Icon } from '@radix-ui/react-icons'

import { ColorPickerDrop, Input } from '@/components/ui'
import { useAppContext } from '@/context/app.context'

import styles from './style.module.sass'

const EditBoardFormSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .trim()
    .min(4, { message: 'The name must consist of at least 4 letters' }),
  statuses: z
    .array(
      z.object({
        name: z
          .string()
          .trim()
          .min(3, { message: 'The name must consist of at least 3 letters' }),
        bg: z.string(),
        id: z.string(),
      })
    )
    .optional(),
})

export type EditBoardFormSchemaType = z.infer<typeof EditBoardFormSchema>

type TEditBoardForm = {
  onClose: () => void
}

export const EditBoardForm: FC<TEditBoardForm> = ({ onClose }) => {
  const [colorPickerContainer, setColorPickerContainer] =
    useState<HTMLElement | null>(null)
  const { updateBoard } = useAppContext.getState()
  const activeBoard = useAppContext((state) =>
    state.boards.find((board) => board.id === state.activeBoardId)
  )

  const methods = useForm<EditBoardFormSchemaType>({
    shouldFocusError: true,
    disabled: false,
    values: activeBoard,
    resolver: zodResolver(EditBoardFormSchema),
  })

  const { handleSubmit, control } = methods

  const {
    fields: columnFields,
    append,
    remove,
  } = useFieldArray({
    name: 'statuses',
    control,
  })

  const handleAddColumn = () => {
    append({ name: '', bg: '#B4D455', id: uuidv4() }, { shouldFocus: false })
  }

  const onSubmit: SubmitHandler<EditBoardFormSchemaType> = (board) => {
    updateBoard({
      id: board.id,
      name: board.name,
      statuses: board.statuses || [],
    })

    onClose()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
      ref={setColorPickerContainer}
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Input
            placeholder="e.g. Project Name - [Month/Year]"
            label="Board Name *"
            field={field}
            fieldState={fieldState}
          />
        )}
      />

      <Flex direction={'column'} gap={'4'} align={'center'}>
        <ul className={styles.list}>
          {columnFields.map((column, index) => (
            <li key={column.id} className={styles.list}>
              <Controller
                name={`statuses.${index}.name`}
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Input
                    label={index == 0 ? 'Board Columns *' : ''}
                    field={field}
                    fieldState={fieldState}
                    placeholder={'Add Status (e.g., In Progress, QA, Done)'}
                    prefix={
                      <Controller
                        name={`statuses.${index}.bg`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <ColorPickerDrop
                            field={field}
                            container={colorPickerContainer}
                          />
                        )}
                      />
                    }
                    postfix={
                      <IconButton variant="ghost" onClick={() => remove(index)}>
                        <Cross1Icon />
                      </IconButton>
                    }
                  />
                )}
              />
            </li>
          ))}
        </ul>
        <Button
          size={'3'}
          variant="ghost"
          onClick={handleAddColumn}
          style={{ width: 'calc(100% - 24px)' }}
          className={cn(styles.btn_wide, styles.btn_secondary)}
        >
          + Add New Column
        </Button>
      </Flex>
      <Button
        size={'3'}
        type={'submit'}
        className={cn(styles.btn, styles.btn_wide, styles.btn_primary)}
      >
        Submit
      </Button>
    </form>
  )
}
