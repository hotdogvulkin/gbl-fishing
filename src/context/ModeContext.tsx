import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type FishingMode = 'freshwater' | 'saltwater'

interface ModeContextValue {
  mode: FishingMode
  setMode: (mode: FishingMode) => void
}

const ModeContext = createContext<ModeContextValue | null>(null)

const STORAGE_KEY = 'gbl_fishing_mode'

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<FishingMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'saltwater' ? 'saltwater' : 'freshwater'
  })

  // Sync data-mode attribute on <html> and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  // Apply the initial attribute before first paint (handles persisted saltwater mode)
  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function setMode(next: FishingMode) {
    setModeState(next)
  }

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be used within <ModeProvider>')
  return ctx
}
