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
  Center,
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
import walletConnectModule from "@web3-onboard/walletconnect"

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
import { Footer } from "../components/Footer"

declare global {
  interface Window {
    provider: any
    ethereum: any
  }
}

const injected = injectedModule()
const walletConnect = walletConnectModule()

const web3Onboard = init({
  wallets: [injected, walletConnect],
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
  const [chainId, setChainId] = useState<number | null>(null)
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
        if (addresses.length && chainId === 80001) {
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
  }, [isConnected, provider, chainId])

  useEffect(() => {
    if (provider && USDCContract && isConnected && chainId === 80001) {
      ;(async () => {
        try {
          const currentAllowance = ethers.utils.formatUnits(
            await USDCContract.allowance(
              provider.getSigner().getAddress(),
              CFPv1Address
            ),
            6
          )
          const currentBalance = ethers.utils.formatUnits(
            await USDCContract.balanceOf(provider.getSigner().getAddress()),
            6
          )
          setBalance(+currentBalance)
          setApprovedAmount(+currentAllowance)
        } catch (error) {
          console.error("an error has occurred:", error)
        }
      })()
    }
  }, [USDCContract, provider, isConnected, chainId])

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
    if (provider && USDCContract && isConnected && chainId === 80001) {
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

  useEffect(() => {
    const handleChainChanged = (newChainId: string) => {
      setChainId(Number(newChainId))
    }

    if (typeof window.ethereum !== "undefined") {
      // Set the initial chainId
      window.ethereum
        .request({ method: "eth_chainId" })
        .then((initialChainId: string) => setChainId(Number(initialChainId)))
        .catch((error: Error) => {
          console.error("Failed to get initial chainId:", error)
          setChainId(80001)
        })

      // Subscribe to the 'chainChanged' event
      window.ethereum.on("chainChanged", handleChainChanged)
    }

    // Clean up the event listener when the component is unmounted
    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  useEffect(() => {
    if (chainId !== 80001) {
      setIsConnected(false)
    }
  }, [chainId])

  async function connectToPolygon() {
    updateAccountCenter({ enabled: false })
    try {
      await connect()
      await setChain({ chainId: "0x80001" })
      setIsConnected(true)
    } catch (error) {
      console.error("An error has occurred:", error)
    }
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
          align="start"
          justify="space-between"
          wrap="wrap"
          padding={3}
          bg={useColorModeValue("white", "#1A202C")}
          color={useColorModeValue("#1A202C", "white")}
          position="fixed"
          width="100%"
          zIndex="1"
        >
          <Flex align="center" paddingTop={2}>
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
            {isConnected ? (
              <Text fontSize="sm" letterSpacing="wide" align="right">
                {address.slice(0, 6)}...{address.slice(-4)}
              </Text>
            ) : (
              <Text></Text>
            )}
            {isConnected ? (
              <Text fontSize="sm" letterSpacing="wide" align="right">
                Balance: {balance} USDC
              </Text>
            ) : (
              <Text></Text>
            )}
            {isConnected ? (
              <Text fontSize="sm" letterSpacing="wide" align="right">
                Approved: {approvedAmount} USDC
              </Text>
            ) : (
              <Text></Text>
            )}
          </Box>
        </Flex>
      </Box>
      <Box mt={20}>{pageContests ? <PrimaryTable /> : <Positions />}</Box>
      <Box pb={{ base: 8, md: 10 }} />
      <Center>
        <Footer />
      </Center>
    </ProviderContext.Provider>
  )
}

export default Home
