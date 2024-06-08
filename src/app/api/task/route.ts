import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import {
  createTask,
  CreateTaskModel,
  reorderTask,
  updateTask,
} from '@/data/task'
import { UpdateTaskRequest } from '@/common/hooks/query/useTaskQuery'

export async function POST(req: NextRequest) {
  const sessionData = await auth()
  const user = sessionData?.user

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' })
  }

  try {
    const { task } = (await req.json()) as {
      task: CreateTaskModel
    }
    console.log('TASK ', task)
    const result = await createTask(task)

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ message: error.message })
  }
}

export async function PATCH(req: NextRequest) {
  const sessionData = await auth()
  console.log('PATH: ', req.nextUrl.pathname)
  const user = sessionData?.user

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' })
  }

  try {
    const { task } = (await req.json()) as {
      task: UpdateTaskRequest
    }

    let result

    if (task.action == 'update') {
      console.log('TASK UPDATE: ', task)
      result = await updateTask(task.payload)
    }

    if (task.action == 'reorder') {
      result = await reorderTask(task.payload)
    }

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ message: error.message })
  }
}
