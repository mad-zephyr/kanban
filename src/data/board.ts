import { Board, Status } from '@prisma/client'

import { db } from '@/lib/db'
import { ServerBoard } from '@/common/models/board-model/ui-board-model'
import { serverMock } from '@/mock_data'
import { auth } from '@/auth'

export type StatusModel = Pick<Status, 'id' | 'bg' | 'name'>

export type BoardModel = Pick<Board, 'id' | 'name' | 'ownerId'> & {
  statuses: StatusModel[]
}

const INCLUDED_GET_OR_DELETE = {
  include: {
    statuses: {
      include: {
        tasks: {
          include: {
            subtasks: true,
          },
        },
      },
    },
  },
}

export const getBoards = async () => {
  const session = await auth()
  const user = session?.user

  if (!user?.id) {
    return serverMock
  }

  return await db.board.findMany({
    where: { id: user.id },
    ...INCLUDED_GET_OR_DELETE,
  })
}

export const createBoard = async (
  board: BoardModel
): Promise<ServerBoard | null> => {
  try {
    await db.board.upsert({
      where: { id: board.id },
      update: {
        name: board.name,
      },
      create: {
        name: board.name || '',
        owner: { connect: { id: board.ownerId } },
      },
    })

    await db.status.createMany({
      data: board.statuses.map((status) => ({
        ...status,
        boardId: board?.id,
      })),
    })

    return await getBoardById(board.id)
  } catch (error) {
    return null
  }
}

export const getBoardsByUserId = async (
  userId: string
): Promise<ServerBoard[] | []> => {
  try {
    const boards = (await db.board.findMany({
      where: { ownerId: userId },
      ...INCLUDED_GET_OR_DELETE,
    })) as unknown as ServerBoard[]

    return boards ? boards : []
  } catch (error) {
    console.log('ERROR: ', error)
  }

  return []
}

export const getBoardById = async (
  boardId: string
): Promise<ServerBoard | null> => {
  try {
    const board = (await db.board.findFirst({
      where: { id: boardId },
      ...INCLUDED_GET_OR_DELETE,
    })) as unknown as ServerBoard

    return board
  } catch (error) {
    return null
  }
}

export const deleteBoardById = async (boardId: string) => {
  try {
    const result = await db.board.delete({
      where: { id: boardId },
      ...INCLUDED_GET_OR_DELETE,
    })
    return result
  } catch (error) {
    return Promise.reject(error)
  }
}

export const updateBoard = async (board: BoardModel) => {
  try {
    const groupedStatuses = await groupStatusOnDeleteAndUpdate(board)

    if (!groupedStatuses) {
      return
    }

    const { statusesToDelete, statusesCreateOrUpdate } = groupedStatuses

    await Promise.allSettled(
      statusesCreateOrUpdate.map((status) =>
        db.status.upsert({
          where: {
            id: status.id,
          },
          update: { bg: status.bg, name: status.name },
          create: {
            ...status,
            board: { connect: { id: board.id } },
          },
        })
      )
    )

    if (statusesToDelete.length) {
      for (const status of statusesToDelete) {
        await db.status.delete({ where: { id: status.id } })
      }
    }

    return await getBoardById(board.id)
  } catch (error) {
    console.warn('BOARD UPDATE ERROR: ', error)
  }
}

async function groupStatusOnDeleteAndUpdate(updatedBoard: BoardModel) {
  const savedBoard = await db.board.findFirst({
    where: { id: updatedBoard.id },
    include: { statuses: true },
  })

  if (!savedBoard) {
    return
  }

  const statusesToDelete = savedBoard.statuses.filter(
    (status) =>
      !updatedBoard.statuses.find((updStatus) => updStatus.id === status.id)
  )

  const statusesCreateOrUpdate = updatedBoard.statuses

  return { statusesCreateOrUpdate, statusesToDelete }
}
