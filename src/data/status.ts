import { db } from '@/lib/db'

import { StatusModel } from './board'

export const createStatuses = async (
  statuses: StatusModel[]
): Promise<boolean> => {
  console.log('CREATED STATUSES: ', statuses)

  try {
    for (const status of statuses) {
      await db.status.upsert({
        create: status,
        update: status,
        where: {
          id: status.id,
        },
      })
    }

    const updStatuses = await db.status.count({
      where: { boardId: statuses[0].boardId },
    })

    return updStatuses === statuses.length
  } catch (error) {
    console.log('ERROR: ', error)
    return false
  }
}
