import React, { Dispatch, SetStateAction } from "react"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Contract } from "ethers"
import { contest, speculation, position } from "../constants/interface"

interface ProviderInterface {
  provider: JsonRpcProvider | undefined | null
  cfpContract: Contract | undefined | null
  USDCContract: Contract | undefined | null
  isConnected: boolean
  address: string
  balance: number
  approvedAmount: number
  setApprovedAmount: Dispatch<SetStateAction<number>>
  isWaiting: boolean
  setIsWaiting: Dispatch<SetStateAction<boolean>>
  contests: contest[] | []
  speculations: speculation[] | []
  positions: position[] | []
}

const defaultState = {
  provider: undefined,
  cfpContract: undefined,
  USDCContract: undefined,
  isConnected: false,
  address: "",
  balance: 0,
  approvedAmount: 0,
  setApprovedAmount: () => {},
  isWaiting: false,
  setIsWaiting: () => {},
  contests: [],
  speculations: [],
  positions: [],
}

export const ProviderContext =
  React.createContext<ProviderInterface>(defaultState)
