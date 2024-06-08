import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { createStatuses } from '@/data/status'

export async function POST(req: NextRequest) {
  const sessionData = await auth()
  const user = sessionData?.user

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' })
  }

  try {
    const { statuses } = await req.json()

    const result = await createStatuses(statuses)

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ message: error.message })
  }
}
