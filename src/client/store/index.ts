'use client'

import { create } from 'zustand'
import type { Session, Message } from '@/shared/types'

interface Store {
  session: Session | null
  messages: Message[]
  isStreaming: boolean
  dashboardReady: boolean
  setSession: (session: Session) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  setIsStreaming: (streaming: boolean) => void
  setDashboardReady: (ready: boolean) => void
  reset: () => void
}

export const useStore = create<Store>((set) => ({
  session: null,
  messages: [],
  isStreaming: false,
  dashboardReady: false,
  setSession: (session) => set({ session }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setDashboardReady: (dashboardReady) => set({ dashboardReady }),
  reset: () => set({ session: null, messages: [], isStreaming: false, dashboardReady: false }),
}))
