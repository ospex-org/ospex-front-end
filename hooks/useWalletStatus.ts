import { useState, useEffect } from "react"

const waitingStateKey = "isWaiting"

export function useWalletStatus() {
  const [isWaiting, setIsWaiting] = useState<boolean | undefined>(undefined)
  const [loadingButtonId, setLoadingButtonId] = useState<string | null>(null)

  // Effect to run only on the client side after initial render
  useEffect(() => {
    // Retrieve the stored state from session storage
    const storedState = sessionStorage.getItem(waitingStateKey)
    // If a stored state exists, parse it to boolean and set it,
    // otherwise, default to false (not waiting)
    setIsWaiting(storedState !== null ? JSON.parse(storedState) : false)
  }, [])

  // Effect to update sessionStorage whenever isWaiting changes
  useEffect(() => {
    // Only update sessionStorage if isWaiting is not undefined
    if (isWaiting !== undefined) {
      sessionStorage.setItem(waitingStateKey, JSON.stringify(isWaiting))
    }
  }, [isWaiting])

  const startWaiting = (buttonId: string) => {
    setIsWaiting(true)
    setLoadingButtonId(buttonId)
  }
  
  const stopWaiting = () => {
    setIsWaiting(false)
    setLoadingButtonId(null)
  }

  return {
    isWaiting,
    loadingButtonId,
    startWaiting,
    stopWaiting,
  }
}
