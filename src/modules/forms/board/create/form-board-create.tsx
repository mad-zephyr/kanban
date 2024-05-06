import { FC, useState } from 'react'
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
import { BoardStatus } from '@/context/todo.context'

import styles from './style.module.sass'

const CreateBoardFormSchema = z.object({
  boardName: z
    .string()
    .trim()
    .min(4, { message: 'The name must consist of at least 4 letters' }),
  statuses: z.array(
    z.object({
      value: z.string().trim().min(3, {
        message: 'The status name must consist of at least 3 letters',
      }),
      bg: z.string(),
      id: z.string(),
    })
  ),
})

export type CreateBoardFormSchemaType = z.infer<typeof CreateBoardFormSchema>

type TCreateBoardForm = {
  onClose: () => void
}

const CreateBoardForm: FC<TCreateBoardForm> = ({ onClose }) => {
  const [colorPickerContainer, setColorPickerContainer] =
    useState<HTMLElement | null>(null)
  const { addBoard } = useAppContext.getState()
  const methods = useForm<CreateBoardFormSchemaType>({
    shouldFocusError: true,
    disabled: false,
    defaultValues: {
      boardName: '',
      statuses: [
        { bg: 'green', id: uuidv4(), value: '' },
        { bg: 'green', id: uuidv4(), value: '' },
      ],
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
    append({ value: '', bg: '#B4D455', id: uuidv4() }, { shouldFocus: false })
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
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      ref={setColorPickerContainer}
    >
      <Controller
        name="boardName"
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
                    placeholder={'Add Status (e.g., In Progress, QA, Done)'}
                    prefix={
                      <Controller
                        name={`statuses.${index}.bg`}
                        control={control}
                        render={({ field }) => (
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
          variant="ghost"
          size={'3'}
          onClick={handleAddColumn}
          style={{ width: 'calc(100% - 24px)' }}
          className={`${(styles.btn, styles.btn_wide, styles.btn_secondary)}`}
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

export default CreateBoardForm
