import { FC, useState } from 'react'
import { z } from 'zod'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'

import { FormTaskEdit, FormTaskShow } from '@/modules/forms'
import { Task } from '@/context/todo.context'
import { useAppContext } from '@/context/app.context'

type TEditTaskFormWrapper = {
  onShowTaskModal: (show: boolean) => void
  task: Task
}

const TaskFormSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(4, { message: 'Reqired' }),
  description: z.string().trim().min(4, { message: 'Reqired' }),
  statusID: z.string(),
  subTasks: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().trim().min(4, { message: 'Reqired' }),
        done: z.boolean(),
      })
    )
    .optional(),
})

export type TaskFormSchemaType = z.infer<typeof TaskFormSchema>

export const EditTaskFormWrapper: FC<TEditTaskFormWrapper> = ({
  onShowTaskModal,
  task,
}) => {
  const { updateTask, deleteTask } = useAppContext.getState()

  const [editTaskMode, setEditMode] = useState(false)
  const [openedTask, setOpenedTask] = useState<Task>()

  const methods = useForm<TaskFormSchemaType>({
    shouldFocusError: true,
    disabled: false,
    defaultValues: {
      ...task,
    },

    resolver: zodResolver(TaskFormSchema),
  })

  const { handleSubmit, control, reset } = methods

  const {
    fields: subtasksFields,
    append,
    remove,
  } = useFieldArray({
    name: 'subTasks',
    control,
  })

  const handleAddSubtask = () => {
    append({ name: '', done: false, id: uuidv4() }, { shouldFocus: false })
  }

  const handleDeleteTask = () => {
    deleteTask(task)
  }

  const showTaskEditForm = openedTask && editTaskMode
  const showTaskShowForm = openedTask && !editTaskMode

  const handleShowTask = (task: Task) => {
    onShowTaskModal(true)
    setOpenedTask(task)
  }

  const handleCloseModalTask = () => {
    onShowTaskModal(false)
    setOpenedTask(undefined)
  }

  return (
    <FormProvider {...methods}>
      {openedTask && (
        <FormTaskEdit
          onClose={handleCloseModalTask}
          task={openedTask}
          onEdit={setEditMode}
          isEdit={editTaskMode}
        />
      )}
      {openedTask && (
        <FormTaskShow
          onClose={handleCloseModalTask}
          task={openedTask}
          onEdit={setEditMode}
        />
      )}
    </FormProvider>
  )
}
