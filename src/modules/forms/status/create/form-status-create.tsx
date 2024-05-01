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

const DEFAULT_STATUS = {
  name: 'Status name',
  bg: '#B4D455',
}

const CreateStatusTaskFormSchema = z.object({
  statuses: z.array(
    z.object({
      id: z.string(),
      name: z.string().trim().min(4, { message: 'Provide column name' }),
      bg: z.string(),
    })
  ),
})

export type CreateStatusTaskFormSchemaType = z.infer<
  typeof CreateStatusTaskFormSchema
>

type TCreateBoardForm = {
  onClose: () => void
}

const CreateTaskStatusesForm: FC<TCreateBoardForm> = ({ onClose }) => {
  const activeBoard = useAppContext((state) =>
    state.boards.find((board) => board.id === state.activeBoardID)
  )

  const { updateBoard } = useAppContext.getState()

  const methods = useForm<CreateStatusTaskFormSchemaType>({
    shouldFocusError: true,
    disabled: false,
    defaultValues: {
      statuses: !!activeBoard?.statuses.length
        ? activeBoard?.statuses
        : [{ ...DEFAULT_STATUS, id: uuidv4() }],
    },
    resolver: zodResolver(CreateStatusTaskFormSchema),
  })

  const { handleSubmit, control } = methods

  const {
    fields: columnStatuses,
    append,
    remove,
  } = useFieldArray({
    name: 'statuses',
    control,
  })

  const handleAddColumn = () => {
    append({ ...DEFAULT_STATUS, id: uuidv4() }, { shouldFocus: true })
  }

  const onSubmit: SubmitHandler<CreateStatusTaskFormSchemaType> = (board) => {
    if (!activeBoard) {
      return
    }

    updateBoard({
      ...activeBoard,
      statuses: board.statuses,
    })
    onClose()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <ul className={styles.list}>
        {columnStatuses.map((status, index) => (
          <li key={status.id}>
            <Controller
              name={`statuses.${index}.name`}
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Input
                  label={index == 0 ? 'Board Columns *' : ''}
                  name={'value'}
                  field={field}
                  fieldState={fieldState}
                  placeholder="Status name"
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
          type={'button'}
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

export default CreateTaskStatusesForm
