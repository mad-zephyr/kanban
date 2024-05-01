import { HTMLAttributes } from 'react'

import { Task } from '@/context/todo.context'

export type TBoardTask = HTMLAttributes<HTMLElement> & {
  data: Task
}
