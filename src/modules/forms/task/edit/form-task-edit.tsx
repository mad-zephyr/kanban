import { FC, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { Button, Flex, IconButton } from '@radix-ui/themes'
import cn from 'classnames'
import { Cross1Icon, Cross2Icon, DotsVerticalIcon } from '@radix-ui/react-icons'
import { Item } from '@radix-ui/react-dropdown-menu'

import { DropDown, Input, Select, Textarea } from '@/components/ui'
import { useAppContext } from '@/common/context/app.context'
import type { Task } from '@/common/context/todo.context'
import { CombinedTaskFormSchemaType } from '@/modules/board/components/board-task/components/combined-form/board-task-combined-form'

import styles from './style.module.sass'

type TFormTaskEdit = {
  onClose: () => void
  task: Task
  isEdit: boolean
  onEdit: (isEdit: boolean) => void
}

export const FormTaskEdit: FC<TFormTaskEdit> = ({ onClose, onEdit, task }) => {
  const methods = useFormContext<CombinedTaskFormSchemaType>()

  const [dropDownContainer, setDropDownContainer] =
    useState<HTMLElement | null>(null)
  const currentBoard = useAppContext((state) =>
    state.boards.find((board) => board.id === state.activeBoardId)
  )

  const handleEditForm = (isEdit: boolean) => {
    onEdit(isEdit)
  }

  const { updateTask, deleteTask, setEditedTask, reorderTask } =
    useAppContext.getState()

  const { handleSubmit, control } = methods

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

  const onSubmit: SubmitHandler<CombinedTaskFormSchemaType> = (currentTask) => {
    const updTask = {
      id: currentTask.id,
      statusId: currentTask.statusId,
      name: currentTask.name,
      subTasks: currentTask?.subTasks || [],
      description: currentTask?.description || '',
    }

    if (task.statusId !== currentTask.statusId) {
      reorderTask(updTask, task.statusId)
      onClose()
    } else {
      updateTask(updTask)
    }

    setEditedTask({
      ...currentTask,
      description: currentTask?.description || '',
    })

    handleEditForm(false)
  }

  const handleDeleteTask = () => {
    deleteTask(task)
    onClose()
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      ref={setDropDownContainer}
    >
      <div className={styles.header}>
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Input
              placeholder={'e.g., Design logo, Schedule meeting'}
              label="Title *"
              field={field}
              fieldState={fieldState}
            />
          )}
        />

        <div className={styles.compact}>
          <DropDown
            className={styles.dropdown}
            container={dropDownContainer}
            triger={
              <IconButton variant="ghost">
                <DotsVerticalIcon />
              </IconButton>
            }
            drowDownProps={{ sideOffset: 12 }}
            content={
              <Item
                onClick={handleDeleteTask}
                className={cn('DropdownMenuItem', styles.itemDelete)}
              >
                Delete Task
              </Item>
            }
          />
          <IconButton
            size={'2'}
            variant="ghost"
            aria-label="Close"
            className={styles.close}
            onClick={onClose}
          >
            <Cross2Icon />
          </IconButton>
        </div>
      </div>

      <Controller
        name="description"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Textarea
            label="Description"
            field={field}
            fieldState={fieldState}
            placeholder={'e.g., write report draft, schedule client call'}
          />
        )}
      />

      <Flex direction={'column'} gap={'4'} align={'center'}>
        {!!subtasksFields.length && (
          <ul className={styles.list}>
            {subtasksFields.map((tasks, index) => (
              <li key={tasks.id}>
                <Controller
                  name={`subTasks.${index}.name`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState }) => (
                    <Input
                      label={index == 0 ? 'Subtasks' : ''}
                      field={field}
                      fieldState={fieldState}
                      postfix={
                        <IconButton
                          variant="ghost"
                          onClick={() => remove(index)}
                        >
                          <Cross1Icon />
                        </IconButton>
                      }
                    />
                  )}
                />
              </li>
            ))}
          </ul>
        )}
        <Button
          variant="ghost"
          size={'3'}
          onClick={handleAddSubtask}
          className={cn(styles.btn_wide, styles.btn_secondary)}
          style={{ width: 'calc(100% - 24px)' }}
        >
          + Add New Subtask
        </Button>
      </Flex>
      <div className={styles.row}>
        <Controller
          name="statusId"
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
