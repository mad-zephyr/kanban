import { FC, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormTaskEdit, FormTaskShow } from '@/modules/forms'
import { useAppContext } from '@/context/app.context'

const CombinedTaskFormSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .trim()
    .min(4, { message: 'The name must consist of at least 4 letters' }),
  description: z.string().trim().optional(),
  statusID: z.string(),
  subTasks: z.array(
    z.object({
      id: z.string(),
      name: z.string().trim().min(4, { message: 'Reqired' }),
      done: z.boolean(),
    })
  ),
})

export type CombinedTaskFormSchemaType = z.infer<typeof CombinedTaskFormSchema>

type TBoardTaskForm = {
  handleCloseModalTask: () => void
}

export const BoardTaskCombinedForm: FC<TBoardTaskForm> = ({
  handleCloseModalTask,
}) => {
  const [editMode, setEditMode] = useState(false)
  const editedTask = useAppContext((state) => state.editedTask)

  const methods = useForm<CombinedTaskFormSchemaType>({
    defaultValues: editedTask,
  })

  const showTaskEditForm = editedTask && editMode
  const showTaskShowForm = editedTask && !editMode

  return (
    <FormProvider {...methods}>
      {showTaskEditForm && (
        <FormTaskEdit
          onClose={handleCloseModalTask}
          task={editedTask}
          onEdit={setEditMode}
          isEdit={editMode}
        />
      )}
      {showTaskShowForm && (
        <FormTaskShow
          onClose={handleCloseModalTask}
          task={editedTask}
          onEdit={setEditMode}
        />
      )}
    </FormProvider>
  )
}
