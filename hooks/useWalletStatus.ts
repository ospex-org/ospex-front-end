import { useState, useEffect } from "react"

const waitingStateKey = "isWaiting"

export function useWalletStatus() {
  const [isWaiting, setIsWaiting] = useState<boolean | undefined>(undefined)

  // Effect to run only on the client side after initial render
  useEffect(() => {
    const getInitialWaitingState = () => {
      const storedValue = localStorage.getItem(waitingStateKey)
      return storedValue ? JSON.parse(storedValue) : false
    }

    // Set the state with the value from localStorage or the default value
    setIsWaiting(getInitialWaitingState())
  }, [])

  // Effect to update localStorage whenever isWaiting changes
  useEffect(() => {
    // Check if isWaiting is not undefined to avoid setting localStorage during initial render
    if (isWaiting !== undefined) {
      localStorage.setItem(waitingStateKey, JSON.stringify(isWaiting))
    }
  }, [isWaiting])

  const startWaiting = () => setIsWaiting(true)
  const stopWaiting = () => setIsWaiting(false)

  return {
    isWaiting,
    startWaiting,
    stopWaiting,
  }
}
