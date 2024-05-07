'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { UiBoardModel } from '@/common/models/board-model/ui-board-model'
import { serverMock } from '@/mock_data'

import { SystemContext, systemContext } from './system.context'
import { todoContext, TodoContext } from './todo.context'

type AppContext = SystemContext & TodoContext

const $STORAGE_NAME = 'kanban_store_v1'

export const useAppContext = create<AppContext>()(
  persist(
    (set, get) => ({
      ...systemContext(set, get),
      ...todoContext(set, get),
    }),
    {
      name: $STORAGE_NAME,
      version: 2,
      migrate: (persistedState, version) => {
        if (version === 0) {
          const state = persistedState as AppContext
          const { boards, tasks } = UiBoardModel(serverMock)

          return { ...state, boards, tasks, activeBoardId: boards[0].id }
        }

        return persistedState
      },
      merge(persistedState, currentState) {
        const state = persistedState as AppContext
        const { boards, tasks } = UiBoardModel(serverMock)

        if (!state) {
          console.log('STATE INITIALIZED')
          return { ...currentState, boards, tasks, activeBoardId: boards[0].id }
        } else {
          return { ...currentState, ...state }
        }
      },
    }
  )
)
