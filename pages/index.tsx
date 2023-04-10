import { Contract, ethers } from "ethers"
import type { NextPage } from "next"
import React, { useState, useEffect } from "react"
import {
  Box,
  Heading,
  Flex,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
  IconButton,
  Divider,
  Hide,
} from "@chakra-ui/react"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { JsonRpcProvider } from "@ethersproject/providers"
import { ProviderContext } from "../contexts/ProviderContext"
import {
  init,
  useAccountCenter,
  useConnectWallet,
  useSetChain,
  useWallets,
} from "@web3-onboard/react"
import injectedModule from "@web3-onboard/injected-wallets"
import coinbaseWalletModule from "@web3-onboard/coinbase"

import PrimaryTable from "./table"
import {
  CFPv1Address,
  JsonRpcProviderUrl,
  USDCAddress,
} from "../constants/addresses"
import { CFPv1Abi } from "../contracts/CFPv1"
import { IERC20Abi } from "../contracts/IERC20"
import { contest, speculation, position } from "../constants/interface"
import Positions from "./positions"
import { contestsGteCurrentTime } from "../constants/queries"
import { useQuery } from "@apollo/client"

declare global {
  interface Window {
    provider: any
    ethereum: any
  }
}

const injected = injectedModule()
const coinbase = coinbaseWalletModule()

const web3Onboard = init({
  wallets: [injected, coinbase],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      label: "Ethereum Mainnet",
      rpcUrl: "https://mainnet.infura.io/v3/ababf9851fd845d0a167825f97eeb12b",
    },
    {
      id: "0x3",
      token: "tROP",
      label: "Ethereum Ropsten Testnet",
      rpcUrl: "https://ropsten.infura.io/v3/ababf9851fd845d0a167825f97eeb12b",
    },
    {
      id: "0x4",
      token: "rETH",
      label: "Ethereum Rinkeby Testnet",
      rpcUrl: "https://rinkeby.infura.io/v3/c2255fddd12e418286d39bd662f393f7",
    },
    {
      id: "0x5",
      token: "GTH",
      label: "Ethereum Goerli Testnet",
      rpcUrl: "https://goerli.optimism.io/",
    },
    {
      id: "0x89",
      token: "MATIC",
      label: "Matic Mainnet",
      rpcUrl: "https://matic-mainnet.chainstacklabs.com",
    },
    {
      id: "0x80001",
      token: "MATIC",
      label: "Polygon Testnet",
      rpcUrl: "https://rpc-mumbai.maticvigil.com",
    },
  ],
  appMetadata: {
    name: "Blocknative",
    icon: "<svg><svg/>",
    description: "Demo app for Onboard V2",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
    ],
  },
})

const Home: NextPage = () => {
  const [{ wallet, connecting }, connect, disconnect, setWalletModules] =
    useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()
  const updateAccountCenter = useAccountCenter()
  const [contests, setContests] = useState<contest[] | []>([])
  const [speculations, setSpeculations] = useState<speculation[] | []>([])
  const [positions, setPositions] = useState<position[] | []>([])
  const [provider, setProvider] = useState<JsonRpcProvider | undefined | null>()
  const { colorMode, toggleColorMode } = useColorMode()
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [pageContests, setPageContests] = useState(true)
  const [cfpContract, setCfpContract] = useState<Contract>()
  const [USDCContract, setUSDCContract] = useState<Contract>()
  const [balance, setBalance] = useState(0)
  const [approvedAmount, setApprovedAmount] = useState(0)
  const [isWaiting, setIsWaiting] = useState(false)

  const { loading, error, data, refetch, startPolling } = useQuery(
    contestsGteCurrentTime,
    {
      variables: {
        eventTime: Math.floor(new Date().getTime() / 1000),
      },
      pollInterval: 5000,
    }
  )

  const togglePage = () => {
    setPageContests((prev) => !prev)
  }

  useEffect(() => {
    startPolling(5000)
  }, [startPolling])

  useEffect(() => {
    refetch()
  }, [data, refetch])

  useEffect(() => {
    ;(async () => {
      if (!provider) {
        if (window.ethereum) {
          const currentProvider = new ethers.providers.Web3Provider(
            window.ethereum as any,
            "any"
          )
          setProvider(currentProvider)
        } else {
          const currentFallbackProvider = new ethers.providers.JsonRpcProvider(
            JsonRpcProviderUrl
          )
          setProvider(currentFallbackProvider)
        }
      } else {
        const addresses = await provider.listAccounts()
        const network = await provider.getNetwork()
        if (addresses.length && network.chainId === 5) {
          setIsConnected(true)
          setAddress(addresses[0].toLowerCase())
        }
        if (provider) {
          setCfpContract(
            new ethers.Contract(CFPv1Address, CFPv1Abi, provider.getSigner())
          )
          setUSDCContract(
            new ethers.Contract(USDCAddress, IERC20Abi, provider.getSigner())
          )
        }
      }
    })()
  }, [isConnected, provider])

  useEffect(() => {
    if (provider && USDCContract && isConnected) {
      ;(async () => {
        try {
          const currentAllowance = ethers.utils.formatEther(
            await USDCContract.allowance(
              provider.getSigner().getAddress(),
              CFPv1Address
            )
          )
          const currentBalance = ethers.utils.formatEther(
            await USDCContract.balanceOf(provider.getSigner().getAddress())
          )
          setBalance(+currentBalance)
          setApprovedAmount(+currentAllowance)
        } catch (error) {
          console.error("an error has occurred:", error)
        }
      })()
    }
  }, [USDCContract, provider, isConnected])

  useEffect(() => {
    ;(async () => {
      const contestsFromQuery: contest[] = []
      const speculationsFromQuery: speculation[] = []
      const positionsFromQuery: position[] = []
      if (data && !loading && !error) {
        await data.contests.forEach((contest: contest) => {
          contestsFromQuery.push(contest)
          if (contest.speculations) {
            contest.speculations.forEach((speculation: speculation) => {
              speculationsFromQuery.push(speculation)
              if (speculation.positions) {
                speculation.positions.forEach((position: position) => {
                  positionsFromQuery.push(position)
                })
              }
            })
          }
        })
        setContests(contestsFromQuery)
        setSpeculations(speculationsFromQuery)
        setPositions(positionsFromQuery)
      }
    })()
  }, [loading, error, data])

  useEffect(() => {
    if (provider && USDCContract && isConnected) {
      ;(async () => {
        try {
          provider.on("block", async () => {
            const currentBalance = ethers.utils.formatEther(
              await USDCContract.balanceOf(provider.getSigner().getAddress())
            )
            setBalance(+currentBalance)
          })
        } catch (error) {
          console.error("an error has occurred:", error)
        }
      })()
    }
  }, [USDCContract, isConnected, provider])

  // useEffect(() => {
  //   const handleChainChanged = () => {
  //     // Force a refresh when the network changes
  //     window.location.reload()
  //   }

  //   if (typeof window.ethereum !== "undefined") {
  //     // Subscribe to the 'chainChanged' event
  //     window.ethereum.on("chainChanged", handleChainChanged)
  //   }

  //   // Clean up the event listener when the component is unmounted
  //   return () => {
  //     if (typeof window.ethereum !== "undefined") {
  //       window.ethereum.removeListener("chainChanged", handleChainChanged)
  //     }
  //   }
  // }, [])

  async function connectToPolygon() {
    updateAccountCenter({ enabled: false })
    await connect()
    await setChain({ chainId: "0x5" })
    setIsConnected(true)
  }

  return (
    <ProviderContext.Provider
      value={{
        provider,
        cfpContract,
        USDCContract,
        isConnected,
        address,
        balance,
        approvedAmount,
        setApprovedAmount,
        isWaiting,
        setIsWaiting,
        contests,
        speculations,
        positions,
      }}
    >
      <Box
        boxShadow="md"
        p="1"
        bg={useColorModeValue("white", "#1A202C")}
        rounded="none"
        mt="-1"
        overflowY="auto"
        maxH="100vh"
      >
        <Flex
          as="header"
          align="center"
          justify="space-between"
          wrap="wrap"
          padding={3}
          bg={useColorModeValue("white", "#1A202C")}
          color={useColorModeValue("#1A202C", "white")}
          position="fixed"
          width="100%"
          zIndex="1"
        >
          <Flex align="center">
            <Heading fontSize="21px" mr={1}>
              ospex.org <Hide below="md">|</Hide>
            </Heading>
            <Hide below="md">
              <Text>Open Speculation Exchange</Text>
            </Hide>
          </Flex>
          <Box>
            <IconButton
              mr={1}
              aria-label="Toggle Mode"
              variant="ghost"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              _hover={{
                bg: useColorModeValue("black", "white"),
                borderColor: useColorModeValue("black", "white"),
                color: useColorModeValue("white", "black"),
              }}
              onClick={toggleColorMode}
            >
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </IconButton>
            {!isConnected ? (
              <Button
                variant="outline"
                borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
                bg={colorMode === "light" ? "#f3f4f6" : "#272b33"}
                _hover={
                  colorMode === "light"
                    ? { bg: "black", borderColor: "black", color: "white" }
                    : { bg: "white", borderColor: "white", color: "black" }
                }
                onClick={async () => await connectToPolygon()}
              >
                Connect
              </Button>
            ) : pageContests ? (
              <Button
                variant="outline"
                borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
                bg={colorMode === "light" ? "#f3f4f6" : "#272b33"}
                _hover={
                  colorMode === "light"
                    ? { bg: "black", borderColor: "black", color: "white" }
                    : { bg: "white", borderColor: "white", color: "black" }
                }
                onClick={togglePage}
              >
                Positions
              </Button>
            ) : (
              <Button
                variant="outline"
                borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
                bg={colorMode === "light" ? "#f3f4f6" : "#272b33"}
                _hover={
                  colorMode === "light"
                    ? { bg: "black", borderColor: "black", color: "white" }
                    : { bg: "white", borderColor: "white", color: "black" }
                }
                onClick={togglePage}
              >
                Contests
              </Button>
            )}
            <Divider mt={2} mb={1} />
            <Text>Approved for: {approvedAmount} USDC</Text>
          </Box>
        </Flex>
      </Box>
      <Box mt={20}>{pageContests ? <PrimaryTable /> : <Positions />}</Box>
      <Box pb={{ base: 8, md: 10 }} />
    </ProviderContext.Provider>
  )
}

export default Home
