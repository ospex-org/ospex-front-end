import React, { Dispatch, SetStateAction } from "react"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Contract } from "ethers"
import { contest, speculation, position } from "../constants/interface"

interface ProviderInterface {
  provider: JsonRpcProvider | undefined | null
  contestOracleResolvedContract: Contract | undefined | null
  cfpContract: Contract | undefined | null
  USDCContract: Contract | undefined | null
  isConnected: boolean
  address: string
  balance: number
  approvedAmount: number
  setApprovedAmount: Dispatch<SetStateAction<number>>
  contests: contest[] | []
  speculations: speculation[] | []
  positions: position[] | []
  isWaiting: boolean | undefined
  startWaiting: () => void
  stopWaiting: () => void
  connectToPolygon: () => void
}

const defaultState = {
  provider: undefined,
  contestOracleResolvedContract: undefined,
  cfpContract: undefined,
  USDCContract: undefined,
  isConnected: false,
  address: "",
  balance: 0,
  approvedAmount: 0,
  setApprovedAmount: () => {},
  contests: [],
  speculations: [],
  positions: [],
  isWaiting: false,
  startWaiting: () => {},
  stopWaiting: () => {},
  connectToPolygon: () => {},
}

export const ProviderContext =
  React.createContext<ProviderInterface>(defaultState)
