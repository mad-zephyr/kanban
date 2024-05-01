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
import { BoardStatus } from '@/context/todo.context'

import styles from './style.module.sass'

const CreateBoardFormSchema = z.object({
  boardName: z.string().trim().min(4, { message: 'Required' }),
  statuses: z.array(
    z.object({
      value: z.string().trim().min(4, { message: 'Provide column name' }),
      bg: z.string(),
    })
  ),
})

export type CreateBoardFormSchemaType = z.infer<typeof CreateBoardFormSchema>

type TCreateBoardForm = {
  onClose: () => void
}

const CreateBoardForm: FC<TCreateBoardForm> = ({ onClose }) => {
  const { addBoard } = useAppContext.getState()
  const methods = useForm<CreateBoardFormSchemaType>({
    shouldFocusError: true,
    disabled: false,
    defaultValues: {
      boardName: '',
      statuses: [],
    },
    resolver: zodResolver(CreateBoardFormSchema),
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
    append({ value: '', bg: '#B4D455' }, { shouldFocus: false })
  }

  const onSubmit: SubmitHandler<CreateBoardFormSchemaType> = (board) => {
    const boardStatus: BoardStatus[] = !board.statuses?.length
      ? []
      : board.statuses.map((column) => ({
          id: uuidv4(),
          name: column.value,
          bg: column.bg,
        }))

    addBoard({
      id: uuidv4(),
      name: board.boardName,
      statuses: boardStatus,
    })

    onClose()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="boardName"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Input label="Board Name *" field={field} fieldState={fieldState} />
        )}
      />

      <ul className={styles.list}>
        {columnStatuses.map((status, index) => (
          <li key={status.id}>
            <Controller
              name={`statuses.${index}.value`}
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Input
                  label={index == 0 ? 'Board Columns *' : ''}
                  name={'value'}
                  field={field}
                  fieldState={fieldState}
                  prefix={
                    <Controller
                      name={`statuses.${index}.bg`}
                      control={control}
                      render={({ field }) => <ColorPicker field={field} />}
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

export default CreateBoardForm
