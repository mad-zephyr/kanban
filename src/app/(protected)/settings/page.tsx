import { FC } from 'react'

import { auth } from '@/auth'

const SettignsPage: FC = async () => {
  const session = await auth()
  return (
    <div style={{ padding: '24px' }}>
      Settings Page <br />
      <br />
      <span>{JSON.stringify(session)}</span>
    </div>
  )
}

export default SettignsPage
