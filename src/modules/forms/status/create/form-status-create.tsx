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

import styles from './style.module.sass'

const DEFAULT_STATUS = {
  name: '',
  bg: '#B4D455',
  id: uuidv4(),
}

const CreateStatusTaskFormSchema = z.object({
  statuses: z.array(
    z.object({
      id: z.string(),
      name: z.string().trim().min(3, {
        message: 'The status name must consist of at least 3 letters',
      }),
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
  const [colorPickerContainer, setColorPickerContainer] =
    useState<HTMLElement | null>(null)

  const activeBoard = useAppContext((state) =>
    state.boards.find((board) => board.id === state.activeBoardId)
  )

  const { updateBoard } = useAppContext.getState()

  const methods = useForm<CreateStatusTaskFormSchemaType>({
    shouldFocusError: true,
    disabled: false,
    defaultValues: {
      statuses: !!activeBoard?.statuses.length
        ? activeBoard?.statuses
        : [DEFAULT_STATUS],
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
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      ref={setColorPickerContainer}
    >
      <Flex direction={'column'} gap={'4'} align={'center'}>
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
          variant="ghost"
          size={'3'}
          onClick={handleAddColumn}
          className={cn(styles.btn_wide, styles.btn_secondary)}
          style={{ width: 'calc(100% - 24px)' }}
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

export default CreateTaskStatusesForm
