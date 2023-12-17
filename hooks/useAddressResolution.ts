import { useState, useEffect } from "react"

export function useAddressResolution(domain: string): string {
  const [resolvedAddress, setResolvedAddress] = useState<string>("")

  useEffect(() => {
    const fetchAddress = async () => {
      if (!domain) return
  
      try {
        const response = await fetch(`/api/resolve-address?domain=${domain}`)
        const data = await response.json()
        setResolvedAddress(data.address || domain)
      } catch (error) {
        console.error("Error fetching address:", error)
        setResolvedAddress('0x0') // Fallback to 0 address if resolution fails
      }
    };
  
    fetchAddress()
  }, [domain])

  return resolvedAddress
}
