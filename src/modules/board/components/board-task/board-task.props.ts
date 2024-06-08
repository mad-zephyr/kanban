import { HTMLAttributes } from 'react'

import { Task } from '@/common/context/todo.context'

export type TBoardTask = HTMLAttributes<HTMLElement> & {
  data: Task
  progressBg?: string
  index: number
}
