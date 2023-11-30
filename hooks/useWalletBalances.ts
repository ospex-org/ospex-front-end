import { useState, useEffect } from "react"
import { Contract, ethers } from "ethers"
import { JsonRpcProvider } from "@ethersproject/providers"
import { CFPv1Address } from "../constants/addresses"

export function useWalletBalances(
  provider: JsonRpcProvider | null | undefined,
  USDCContract: Contract | null | undefined,
  isConnected: boolean,
  chainId: number | null
) {
  const [balance, setBalance] = useState(0)
  const [approvedAmount, setApprovedAmount] = useState(0)

  useEffect(() => {
    if (provider && USDCContract && isConnected && chainId === 137) {
      const fetchAndUpdateData = async () => {
        try {
          const signerAddress = await provider.getSigner().getAddress()
          const currentAllowance = ethers.utils.formatUnits(
            await USDCContract.allowance(signerAddress, CFPv1Address),
            6
          )
          const currentBalance = ethers.utils.formatUnits(
            await USDCContract.balanceOf(signerAddress),
            6
          )
          setBalance(+currentBalance)
          setApprovedAmount(+currentAllowance)
        } catch (error) {
          console.error("An error has occurred:", error)
        }
      }

      const updateDataOnBlock = async () => {
        provider.on("block", fetchAndUpdateData)
      }

      updateDataOnBlock()

      return () => {
        // Clean up the event listener when the component is unmounted or dependencies change
        provider.off("block", fetchAndUpdateData)
      }
    }
  }, [USDCContract, provider, isConnected, chainId])

  return {
    balance,
    approvedAmount,
    setApprovedAmount,
  }
}
