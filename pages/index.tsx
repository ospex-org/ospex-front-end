import type { NextPage } from "next"
import React, { useState, useContext } from "react"
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
  useDisclosure,
} from "@chakra-ui/react"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { ProviderContext } from "../contexts/ProviderContext"
import PrimaryTable from "../sections/table"
import Positions from "../sections/positions"
import { Footer } from "../components/Footer"
import { useQueryResults } from "../hooks/useQueryResults"
import { client } from "../utils/apolloClient"
import { TransactionStatusModal } from "../components/TransactionStatusModal"

const Home: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const [pageContests, setPageContests] = useState(true)

  const {
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
    isWaiting,
    startWaiting,
    stopWaiting,
    connectToPolygon,
  } = useContext(ProviderContext)

  const { contests, speculations, positions } = useQueryResults(client)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const togglePage = () => {
    setPageContests((prev) => !prev)
  }

  return (
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
        contests,
        speculations,
        positions,
        isWaiting,
        startWaiting,
        stopWaiting,
        connectToPolygon,
      }}
    >
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
            <Heading fontSize="21px" mr={1}>
              ospex.org <Hide below="md">|</Hide>
            </Heading>
            <Hide below="md">
              <Text>Open Speculation Exchange</Text>
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
            </Flex>
            <Divider mt={2} mb={1} />
            {isConnected ? (
              <>
                <Text fontSize="sm" letterSpacing="wide" align="right">
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
        <TransactionStatusModal isOpen={isOpen} onClose={onClose} />
      </Box>
      <Box mt="100px">{pageContests ? <PrimaryTable /> : <Positions />}</Box>
      <Box pb={{ base: 8, md: 10 }} />
      <Center>
        <Footer />
      </Center>
    </ProviderContext.Provider>
  )
}

export default Home
