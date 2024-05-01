import { FC } from 'react'
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, IconButton } from '@radix-ui/themes'
import cn from 'classnames'
import { v4 as uuidv4 } from 'uuid'
import { Cross1Icon } from '@radix-ui/react-icons'

import { ColorPicker, Input } from '@/components/ui'
import { useAppContext } from '@/context/app.context'

import styles from './style.module.sass'

const EditBoardFormSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(4, { message: 'Required' }),
  statuses: z
    .array(
      z.object({
        name: z.string().trim().min(4, { message: 'Provide column name' }),
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
  const { updateBoard } = useAppContext.getState()
  const activeBoard = useAppContext((state) =>
    state.boards.find((board) => board.id === state.activeBoardID)
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
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Input label="Board Name *" field={field} fieldState={fieldState} />
        )}
      />

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
                  prefix={
                    <Controller
                      name={`statuses.${index}.bg`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <ColorPicker field={field} />
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
        <Button
          size={'3'}
          onClick={handleAddColumn}
          className={cn(styles.btn_wide, styles.btn_secondary)}
        >
          + Add New Column
        </Button>
      </ul>

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
