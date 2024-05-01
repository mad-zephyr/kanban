import { zodResolver } from '@hookform/resolvers/zod'
import { FC } from 'react'
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { Button, IconButton } from '@radix-ui/themes'
import cn from 'classnames'
import { Cross1Icon } from '@radix-ui/react-icons'

import { Input, Select, Textarea } from '@/components/ui'
import { useAppContext } from '@/context/app.context'

import styles from './style.module.sass'

const CreateTaskFormSchema = z.object({
  name: z.string().trim().min(4, { message: 'Reqired' }),
  description: z.string().trim().min(4, { message: 'Reqired' }),
  statusID: z.string(),
  subtasks: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().trim().min(4, { message: 'Reqired' }),
        done: z.boolean(),
      })
    )
    .optional(),
})

export type CreateTaskFormSchemaType = z.infer<typeof CreateTaskFormSchema>

type TFormTaskCreate = {
  onClose: () => void
}

const DEFAULT_VALUE = {
  name: '',
  subtasks: [],
  description: '',
}

export const FormTaskCreate: FC<TFormTaskCreate> = ({ onClose }) => {
  const currentBoard = useAppContext((state) =>
    state.boards.find((board) => board.id === state.activeBoardID)
  )

  const { createTask } = useAppContext.getState()

  const methods = useForm<CreateTaskFormSchemaType>({
    shouldFocusError: true,
    disabled: false,
    defaultValues: {
      ...DEFAULT_VALUE,
      statusID: currentBoard?.statuses[0]?.id,
    },
    resolver: zodResolver(CreateTaskFormSchema),
  })

  const { handleSubmit, control } = methods

  const {
    fields: subtasksFields,
    append,
    remove,
  } = useFieldArray({
    name: 'subtasks',
    control,
  })

  const handleAddSubtask = () => {
    append({ name: '', done: false, id: uuidv4() }, { shouldFocus: false })
  }
  const onSubmit: SubmitHandler<CreateTaskFormSchemaType> = (task) => {
    console.log('onSubmit taks', task)

    createTask({
      id: uuidv4(),
      statusID: task.statusID,
      name: task.name,
      subTasks: task?.subtasks || [],
      description: task?.description || '',
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
          <Input label="Title *" field={field} fieldState={fieldState} />
        )}
      />
      <Controller
        name="description"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Textarea
            label="Description"
            field={field}
            fieldState={fieldState}
            placeholder={'Reply to comment…'}
          />
        )}
      />
      <ul className={styles.list}>
        {subtasksFields.map((tasks, index) => (
          <li key={tasks.id}>
            <Controller
              name={`subtasks.${index}.name`}
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Input
                  label={index == 0 ? 'Subtasks' : ''}
                  field={field}
                  value={field.value}
                  fieldState={fieldState}
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
        <div className={styles.row}>
          <Button
            size={'3'}
            onClick={handleAddSubtask}
            className={cn(styles.btn_wide, styles.btn_secondary)}
          >
            + Add New Subtask
          </Button>
        </div>
      </ul>

      <div className={styles.row}>
        <Controller
          name="statusID"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Select
              label="Current Status"
              field={field}
              fieldState={fieldState}
              options={currentBoard?.statuses}
            />
          )}
        />
      </div>
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
