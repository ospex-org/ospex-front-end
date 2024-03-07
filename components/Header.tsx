import type { NextPage } from "next"
import { useRouter } from 'next/router'
import React, { useContext } from "react"
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
  useDisclosure,
} from "@chakra-ui/react"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { ProviderContext } from "../contexts/ProviderContext"
import { TransactionStatusModal } from "../components/TransactionStatusModal"

export const Header: NextPage = () => {
  const router = useRouter()
  const { colorMode, toggleColorMode } = useColorMode()

  const navigateHome = () => {
    router.push('/')
  }

  const navigateToProfile = () => {
    const profilePath = domainName !== address ? `/u/${domainName}` : `/u/${address}`
    router.push(profilePath);
  }

  const {
    isConnected,
    address,
    domainName,
    balance,
    approvedAmount,
    isWaiting,
    stopWaiting,
    connectToPolygon,
  } = useContext(ProviderContext)

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box
        boxShadow="md"
        p="1"
        bg={useColorModeValue("white", "#1A202C")}
        rounded="none"
        mt="-1"
        overflowY="auto"
        maxH="calc(100vh - 100px)"
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
            <Heading fontSize="21px" mr={1} onClick={navigateHome} _hover={{ cursor: "pointer" }}>
              ospex.org <Hide below="md">|</Hide>
            </Heading>
            <Hide below="md">
              <Text onClick={navigateHome} _hover={{ cursor: "pointer" }}>Open Speculation Exchange</Text>
            </Hide>
          </Flex>
          <Box width="160px">
            <Flex justifyContent="flex-end">
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
                  onClick={navigateHome}
                >
                  Contests
                </Button>
              )}
            </Flex>
            <Divider mt={2} mb={1} />
            {isConnected ? (
              <>
                <Text fontSize="sm" letterSpacing="wide" align="right" onClick={navigateToProfile} _hover={{ cursor: "pointer" }}>
                  {domainName === address
                    ? `${address.slice(0, 6)}...${address.slice(-4)}`
                    : domainName}
                </Text>
                <Text fontSize="sm" letterSpacing="wide" align="right">
                  Balance: {balance.toFixed(2)} USDC
                </Text>
                <Text fontSize="sm" letterSpacing="wide" align="right">
                  Approved: {approvedAmount.toFixed(2)} USDC
                </Text>
                {isWaiting && (
                  <Flex alignItems="left" paddingLeft="3.5">
                    <Text
                      fontSize="sm"
                      className="blinking-dots"
                      cursor="pointer"
                      letterSpacing="wide"
                      onClick={() => {
                        onOpen()
                      }}
                    >
                      Transaction pending
                    </Text>
                  </Flex>
                )}
              </>
            ) : (
              <Text></Text>
            )}
          </Box>
        </Flex>
        <TransactionStatusModal isOpen={isOpen} onClose={onClose} stopWaiting={stopWaiting} />
      </Box>
    </>
  )
}