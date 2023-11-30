import { useState, useEffect } from "react"
import { Contract, ethers } from "ethers"
import { JsonRpcProvider } from "@ethersproject/providers"
import injectedModule from "@web3-onboard/injected-wallets"
import walletConnectModule from "@web3-onboard/walletconnect"
import {
  init,
  useAccountCenter,
  useConnectWallet,
  useSetChain,
  useWallets,
} from "@web3-onboard/react"
import {
  ContestOracleResolvedAddress,
  CFPv1Address,
  JsonRpcProviderUrl,
  USDCAddress,
} from "../constants/addresses"
import { CFPv1Abi } from "../contracts/CFPv1"
import { ContestOracleResolvedAbi } from "../contracts/ContestOracleResolved"
import { IERC20Abi } from "../contracts/IERC20"

declare global {
  interface Window {
    provider: any
    ethereum: any
  }
}

const wcInitOptions = {
  projectId: "8c38871627d74115d3e9d29ecdbc1155",
  requiredChains: [1, 89, 137],
  dappUrl: "https://ospex.org",
}

const injected = injectedModule()
const walletConnect = walletConnectModule(wcInitOptions)

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

export function useWalletConnection() {
  const [{ wallet, connecting }, connect, disconnect, setWalletModules] =
    useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()
  const updateAccountCenter = useAccountCenter()
  const [provider, setProvider] = useState<JsonRpcProvider | undefined | null>()
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [cfpContract, setCfpContract] = useState<Contract>()
  const [contestOracleResolvedContract, setContestOracleResolvedContract] =
    useState<Contract>()
  const [USDCContract, setUSDCContract] = useState<Contract>()

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
        if (addresses.length && chainId === 137) {
          setIsConnected(true)
          setAddress(addresses[0].toLowerCase())
        }
        if (provider) {
          setCfpContract(
            new ethers.Contract(CFPv1Address, CFPv1Abi, provider.getSigner())
          )
          setContestOracleResolvedContract(
            new ethers.Contract(
              ContestOracleResolvedAddress,
              ContestOracleResolvedAbi,
              provider.getSigner()
            )
          )
          setUSDCContract(
            new ethers.Contract(USDCAddress, IERC20Abi, provider.getSigner())
          )
        }
      }
    })()
  }, [isConnected, provider, chainId])

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
          setChainId(137)
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
    if (chainId !== 137) {
      setIsConnected(false)
    }
  }, [chainId])

  async function connectToPolygon() {
    updateAccountCenter({ enabled: false })
    try {
      await connect()
      await setChain({ chainId: "0x89" })
      setIsConnected(true)
    } catch (error) {
      console.error("An error has occurred:", error)
    }
  }

  return {
    provider,
    isConnected,
    address,
    chainId,
    contestOracleResolvedContract,
    cfpContract,
    USDCContract,
    connectToPolygon,
  }
}
