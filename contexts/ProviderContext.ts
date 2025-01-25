import React, { Dispatch, SetStateAction } from "react"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Contract } from "ethers"
import { contest, speculation, position, userPosition } from "../constants/interface"

interface ProviderInterface {
  provider: JsonRpcProvider | undefined | null
  contestOracleResolvedContract: Contract | undefined | null
  cfpContract: Contract | undefined | null
  USDCContract: Contract | undefined | null
  isConnected: boolean
  address: string
  domainName: string
  balance: number
  approvedAmount: number
  setApprovedAmount: Dispatch<SetStateAction<number>>
  contests: contest[] | []
  speculations: speculation[] | []
  positions: position[] | []
  userContests: contest[] | []
  userSpeculations: speculation[] | []
  userPositions: position[] | []
  isLoadingContests: boolean
  isLoadingPositions: boolean
  isWaiting: boolean
  loadingButtonId: string | null
  startWaiting: (buttonId: string) => void
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
  domainName: "",
  balance: 0,
  approvedAmount: 0,
  setApprovedAmount: () => {},
  contests: [],
  speculations: [],
  positions: [],
  userContests: [],
  userSpeculations: [],
  userPositions: [],
  isLoadingContests: false,
  isLoadingPositions: false,
  isWaiting: false,
  loadingButtonId: null,
  startWaiting: () => {},
  stopWaiting: () => {},
  connectToPolygon: () => {},
}

export const ProviderContext =
  React.createContext<ProviderInterface>(defaultState)
