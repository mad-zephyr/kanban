import { FC, useEffect, useState } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { IconButton, Text } from '@radix-ui/themes'
import cn from 'classnames'
import { Cross1Icon, Cross2Icon, DotsVerticalIcon } from '@radix-ui/react-icons'
import { Item } from '@radix-ui/react-dropdown-menu'

import { Checkbox, DropDown, Label, Select } from '@/components/ui'
import { useAppContext } from '@/common/context/app.context'
import type { Task } from '@/common/context/todo.context'
import { CombinedTaskFormSchemaType } from '@/modules/board/components/board-task/components'
import { useUpdateTask } from '@/common/hooks/query/useTaskQuery'
import { populateSubTaskWithTaskId } from '@/common/helpers/task.helper'

import styles from './style.module.sass'

type TFormTaskEdit = {
  onClose: () => void
  task: Task
  onEdit: (isEdit: boolean) => void
}

export const FormTaskShow: FC<TFormTaskEdit> = ({ onClose, onEdit, task }) => {
  const updateDbTask = useUpdateTask()
  const methods = useFormContext<CombinedTaskFormSchemaType>()

  const [dropDownContainer, setDropDownContainer] =
    useState<HTMLElement | null>(null)

  const currentBoard = useAppContext((state) =>
    state.boards.find((board) => board.id === state.activeBoardId)
  )

  const { updateTask, deleteTask, reorderTask } = useAppContext.getState()

  const { control, watch } = methods

  const { fields: subtasksFields, remove } = useFieldArray({
    name: 'subTasks',
    control,
  })

  const handleDeleteTask = () => {
    deleteTask(task)
    onClose()
  }

  useEffect(() => {
    const { unsubscribe } = watch((updTask) => {
      const taskToUpdate = {
        ...task,
        statusId: updTask.statusId,
        subTasks: updTask.subTasks ? updTask.subTasks : [],
      } as unknown as Task

      const taskDbToUpdate = populateSubTaskWithTaskId(taskToUpdate)

      if (task.statusId !== updTask.statusId) {
        reorderTask(taskToUpdate, task.statusId)
        updateDbTask.mutate({ action: 'reorder', payload: taskDbToUpdate })
        onClose()
      } else {
        updateTask(taskToUpdate)
        updateDbTask.mutate({ action: 'update', payload: taskDbToUpdate })
      }
    })

    return () => unsubscribe()
  }, [onClose, reorderTask, task, updateDbTask, updateTask, watch])

  return (
    <form className={styles.form} ref={setDropDownContainer}>
      <div className={styles.row}>
        <div className={styles.header}>
          <Text className={styles.header_content}>{task.name}</Text>
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
                <>
                  <Item
                    onClick={() => onEdit(true)}
                    className="DropdownMenuItem"
                  >
                    Edit Task
                  </Item>
                  <Item
                    onClick={handleDeleteTask}
                    className={cn('DropdownMenuItem', styles.itemDelete)}
                  >
                    Delete Task
                  </Item>
                </>
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
        {task.description && (
          <Text className={styles.description}>{task.description}</Text>
        )}
      </div>
      {!!subtasksFields.length && (
        <ul className={styles.list}>
          <Label text={'Subtasks'} />
          {subtasksFields.map((tks, index) => (
            <li key={tks.id}>
              <Controller
                name={`subTasks.${index}.done`}
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Checkbox
                    label={tks?.name}
                    field={field}
                    fieldState={fieldState}
                    className={styles.btn_wide}
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
      )}
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
    </form>
  )
}
