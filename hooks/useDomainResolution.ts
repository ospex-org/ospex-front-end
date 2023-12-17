import { useState, useEffect } from "react"

export function useDomainResolution(walletAddress: string): string {
  const [domainName, setDomainName] = useState<string>("")

  useEffect(() => {
    const fetchDomainName = async () => {
      if (!walletAddress) return
  
      try {
        const response = await fetch(`/api/resolve-domain?address=${walletAddress}`)
        const data = await response.json()
        setDomainName(data.domain || walletAddress)
      } catch (error) {
        console.error("Error fetching domain:", error)
        setDomainName(walletAddress) // Fallback to wallet address if resolution fails
      }
    };
  
    fetchDomainName()
  }, [walletAddress])

  return domainName
}
