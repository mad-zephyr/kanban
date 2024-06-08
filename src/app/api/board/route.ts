import { NextRequest, NextResponse } from 'next/server'

import {
  createBoard,
  deleteBoardById,
  getBoardById,
  getBoardsByUserId,
  updateBoard,
} from '@/data/board'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  const sessionData = await auth()
  const user = sessionData?.user

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' })
  }

  try {
    const { board } = await req.json()

    const result = await createBoard({ ...board, ownerId: user.id })

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ message: error.message })
  }
}

export async function GET() {
  const sessionData = await auth()
  const user = sessionData?.user

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' })
  }

  try {
    const boards = await getBoardsByUserId(user.id)

    return NextResponse.json(boards)
  } catch (error: any) {
    return NextResponse.json({ message: error.message })
  }
}

export async function DELETE(req: NextRequest) {
  const sessionData = await auth()
  const user = sessionData?.user

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }) //status(401)
  }

  try {
    const { board } = await req.json()
    console.log('BOARD TO DELETED: ', board)

    const boardToDelete = await getBoardById(board.id)

    if (user?.id === boardToDelete?.ownerId || user.role === 'ADMIN') {
      const isBoardDeleted = await deleteBoardById(board.id)

      if (isBoardDeleted) {
        console.log('BOARD DELETED: ', isBoardDeleted)
        return NextResponse.json({
          message: `Board with id ${board.id} deleted`,
        })
      } else {
        return NextResponse.json({
          message: `BOARD with id ${board.id} didn't delete`,
        })
      }
    } else {
      return NextResponse.json({ message: 'Unauthorized for this action' }) //status(401)
    }
  } catch (error) {}
}

export async function PATCH(req: NextRequest) {
  const sessionData = await auth()
  const user = sessionData?.user

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }) //status(401)
  }

  try {
    const { board } = await req.json()
    console.log('BOARD TO PATCH: ', board)
    const updatedBoard = await updateBoard(board)

    return NextResponse.json(updatedBoard)
  } catch (error) {}
}
