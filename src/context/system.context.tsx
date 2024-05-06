import { StoreApi } from 'zustand'

type Toast = {
  id: string
}

export interface SystemSliceContext {
  lightTheme: boolean
  sidebarOpen: boolean
}

export type SystemSliceAction = {
  setLightTheme: () => void
  setSidebarOpen: () => void
}

export type SystemContext = SystemSliceAction & SystemSliceContext

export const systemContext = (
  set: StoreApi<SystemContext>['setState'],
  get: StoreApi<SystemContext>['getState']
) => ({
  lightTheme: false,
  setLightTheme: () => set((state) => ({ lightTheme: !state.lightTheme })),

  sidebarOpen: true,
  setSidebarOpen: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
})
