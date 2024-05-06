'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { SystemContext, systemContext } from './system.context'
import { TodoContext, todoContext } from './todo.context'

type AppContext = SystemContext & TodoContext

const $STORAGE_NAME = 'kanban_store_v1'

export const useAppContext = create<AppContext>()(
  persist(
    (set, get) => ({
      ...systemContext(set, get),
      ...todoContext(set, get),
    }),
    { name: $STORAGE_NAME }
  )
)
