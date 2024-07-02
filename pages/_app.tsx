import "../styles/globals.css"
import type { AppProps } from "next/app"
import { ApolloProvider } from "@apollo/client"
import { ChakraProvider } from "@chakra-ui/react"
import { ProviderContext } from "../contexts/ProviderContext"

import { useWalletConnection } from "../hooks/useWalletConnection"
import { useWalletStatus } from "../hooks/useWalletStatus"
import { useWalletBalances } from "../hooks/useWalletBalances"
import { useDomainResolution } from "../hooks/useDomainResolution"

import { client } from "../utils/apolloClient"

function MyApp({ Component, pageProps }: AppProps) {
  const {
    provider,
    isConnected,
    address,
    chainId,
    contestOracleResolvedContract,
    cfpContract,
    USDCContract,
    connectToPolygon,
  } = useWalletConnection()

  const { isWaiting, startWaiting, stopWaiting } = useWalletStatus()

  const { balance, approvedAmount, setApprovedAmount } = useWalletBalances(
    provider,
    USDCContract,
    isConnected,
    chainId
  )

  const domainName = useDomainResolution(address)

  return (
    <ApolloProvider client={client}>
    <ChakraProvider>
      <ProviderContext.Provider
        value={{
          provider,
          contestOracleResolvedContract,
          cfpContract,
          USDCContract,
          isConnected,
          address,
          domainName,
          balance,
          approvedAmount,
          setApprovedAmount,
          contests: [],
          speculations: [],
          positions: [],
          isLoadingContests: false,
          isWaiting,
          startWaiting,
          stopWaiting,
          connectToPolygon,
        }}
      >
        <Component {...pageProps} />
      </ProviderContext.Provider>
    </ChakraProvider>
    </ApolloProvider>
  )
}

export default MyApp
