import { Board } from '@prisma/client'

export type CreateBoardRequest = Pick<Board, 'id' | 'name'>
export type DeleteBoardRequest = Pick<Board, 'id' | 'name'>
