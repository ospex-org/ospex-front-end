import { useContext, useState } from "react"
import type { NextPage } from "next"
import { ethers } from "ethers"
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Hide,
  IconButton,
  Input,
  Spacer,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import { ProviderContext } from "../contexts/ProviderContext"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { Footer } from "../components/Footer"
import { handleFileUpload } from "../scripts/fileUpload"
import { getEncryptedSecretsUrls } from "../scripts/getEncryptedSecretsUrls"
import { subscriptionId, linkTokenAddress } from "../constants/functions"
import { ContestOracleResolvedAddress } from "../constants/addresses"
import { ScoreContest } from "../components/ScoreContest"
import { contest } from "../constants/interface"
import { useAdminQueryResults } from "../hooks/useAdminQueryResults"
import { client } from "../utils/apolloClient"

const Admin: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  const {
    isConnected,
    address,
    balance,
    approvedAmount,
    connectToPolygon,
    provider,
    contestOracleResolvedContract,
    isWaiting,
    startWaiting,
    stopWaiting,
  } = useContext(ProviderContext)

  const { adminContests } = useAdminQueryResults(client)

  const [rundownId, setRundownId] = useState("")
  const [sportspageId, setSportspageId] = useState("")
  const [jsonoddsId, setJsonoddsId] = useState("")
  const [createContestSource, setCreateContestSource] = useState("")

  const RenderCards = () => {
    return (
      <>
        {/* {console.log(contests)} */}
        {adminContests
          .filter((contest: contest) => contest.contestStatus === "Verified")
          .map((contest: contest) => (
            <ScoreContest key={contest.id} contest={contest} />
          ))}
      </>
    )
  }

  return (
    <>
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
            ) : (
              <Button
                disabled
                variant="outline"
                borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
                bg={colorMode === "light" ? "#f3f4f6" : "#272b33"}
                _hover={
                  colorMode === "light"
                    ? { bg: "black", borderColor: "black", color: "white" }
                    : { bg: "white", borderColor: "white", color: "black" }
                }
              >
                Admin
              </Button>
            )}
            <Divider mt={2} mb={1} />
            {isConnected ? (
              <>
                <Text fontSize="sm" letterSpacing="wide" align="right">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </Text>
                <Text fontSize="sm" letterSpacing="wide" align="right">
                  Balance: {balance.toFixed(2)} USDC
                </Text>
                <Text fontSize="sm" letterSpacing="wide" align="right">
                  Approved: {approvedAmount.toFixed(2)} USDC
                </Text>
              </>
            ) : (
              <Text></Text>
            )}
          </Box>
        </Flex>
      </Box>
      <Center>
        <Box flexDirection="column" alignContent="center" m="0 auto">
          <Flex alignItems="center" wrap="wrap" w="100%" mt="40" mb="5">
            <Box
              width="380px"
              maxW="md"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              <Box p="4">
                <Box display="flex" alignItems="baseline">
                  <Badge borderRadius="full" px="2" colorScheme="gray">
                    Create contest
                  </Badge>
                </Box>

                <Box mt="1" lineHeight="tight" mb="2">
                  <Text fontSize="sm" fontWeight="semibold" mb="1">
                    Rundown Id
                  </Text>
                  <Input
                    placeholder="Rundown Id"
                    value={rundownId}
                    onChange={(e) => setRundownId(e.target.value)}
                  />
                </Box>
                <Divider my="2" />

                <Box lineHeight="tight" mb="2">
                  <Text fontSize="sm" fontWeight="semibold" mb="1">
                    Sportspage Id
                  </Text>
                  <Input
                    placeholder="Sportspage Id"
                    value={sportspageId}
                    onChange={(e) => setSportspageId(e.target.value)}
                  />
                </Box>
                <Divider my="2" />

                <Box lineHeight="tight" mb="2">
                  <Text fontSize="sm" fontWeight="semibold" mb="1">
                    Jsonodds Id
                  </Text>
                  <Input
                    placeholder="Jsonodds Id"
                    value={jsonoddsId}
                    onChange={(e) => setJsonoddsId(e.target.value)}
                  />
                </Box>
                <Divider my="2" />

                <Box lineHeight="tight" mb="2">
                  <Text fontSize="sm" fontWeight="semibold" mb="1">
                    Create Contest Source
                  </Text>
                  <Input
                    type="file"
                    accept=".js"
                    onChange={(e) =>
                      handleFileUpload(e, setCreateContestSource)
                    }
                  />
                </Box>

                <Button
                  isLoading={isWaiting}
                  disabled={!provider || isWaiting}
                  fontWeight="bold"
                  variant="outline"
                  size="sm"
                  mt="2"
                  borderColor="gray.300"
                  bg={colorMode === "light" ? "#f3f4f6" : "#272b33"}
                  color={colorMode === "light" ? "black" : "white"}
                  mb={1.5}
                  _hover={
                    colorMode === "light"
                      ? { bg: "black", borderColor: "black", color: "white" }
                      : { bg: "white", borderColor: "white", color: "black" }
                  }
                  onClick={() => {
                    if (provider) {
                      ;(async () => {
                        try {
                          startWaiting()
                          const encryptedSecretsUrls =
                            await getEncryptedSecretsUrls()
                          const gasLimit = 300000
                          const linkAmount = ethers.utils.parseUnits(
                            "0.0125",
                            18
                          )
                          const IERC20_ABI = [
                            "function approve(address spender, uint256 amount) external returns (bool)",
                          ]
                          const linkTokenContract = new ethers.Contract(
                            linkTokenAddress,
                            IERC20_ABI,
                            provider.getSigner()
                          )
                          const approvalTx = await linkTokenContract.approve(
                            ContestOracleResolvedAddress,
                            linkAmount
                          )
                          await approvalTx.wait()
                          const createContestTx =
                            await contestOracleResolvedContract!.createContest(
                              rundownId,
                              sportspageId,
                              jsonoddsId,
                              createContestSource,
                              encryptedSecretsUrls,
                              subscriptionId,
                              gasLimit,
                              { gasLimit: 1000000 }
                            )
                          await createContestTx.wait()
                        } catch (error) {
                          console.error("an error has occurred:", error)
                        } finally {
                          stopWaiting()
                        }
                      })()
                    }
                  }}
                >
                  Create Contest
                </Button>
              </Box>
            </Box>
          </Flex>
          <>{RenderCards()}</>
          <Spacer height="50px" />
        </Box>
        <Footer />
      </Center>
    </>
  )
}

export default Admin
