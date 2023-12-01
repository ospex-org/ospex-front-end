import { useState, useContext } from "react"
import { ethers } from "ethers"
import { contest } from "../constants/interface"
import { handleFileUpload } from "../scripts/fileUpload"
import {
  Box,
  Flex,
  Badge,
  Text,
  Input,
  Divider,
  Button,
  useColorMode,
} from "@chakra-ui/react"
import { ProviderContext } from "../contexts/ProviderContext"
import { subscriptionId, linkTokenAddress } from "../constants/functions"
import { getEncryptedSecretsUrls } from "../scripts/getEncryptedSecretsUrls"
import { ContestOracleResolvedAddress } from "../constants/addresses"

type ContestCardProps = {
  contest: contest
}

export function ScoreContest({ contest }: ContestCardProps) {
  const [scoreContestSource, setScoreContestSource] = useState("")
  const { colorMode } = useColorMode()

  const {
    provider,
    contestOracleResolvedContract,
    isWaiting,
    startWaiting,
    stopWaiting,
  } = useContext(ProviderContext)

  const scoreContest = async () => {
    if (provider) {
      ;(async () => {
        try {
          startWaiting()
          const encryptedSecretsUrls = await getEncryptedSecretsUrls()
          const gasLimit = 300000
          const linkAmount = ethers.utils.parseUnits("0.0125", 18)
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
          const scoreContestTx =
            await contestOracleResolvedContract!.scoreContest(
              contest.id,
              scoreContestSource,
              encryptedSecretsUrls,
              subscriptionId,
              gasLimit,
              { gasLimit: 1000000 }
            )
          await scoreContestTx.wait()
        } catch (error) {
          console.error("an error has occurred:", error)
        } finally {
          stopWaiting()
        }
      })()
    }
  }

  return (
    <>
      <Flex alignItems="center" wrap="wrap" w="100%" mt="4" mb="5">
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
                Score Contest
              </Badge>
            </Box>

            <Box mt="1" lineHeight="tight" mb="2">
              <Text fontSize="sm" fontWeight="semibold" mb="1">
                Contest ID: {contest.id}
              </Text>
            </Box>
            <Divider my="2" />

            <Box mt="1" lineHeight="tight" mb="2">
              <Text fontSize="sm">Away Team: {contest.awayTeam}</Text>
              <Text fontSize="sm">Home Team: {contest.homeTeam}</Text>
              <Text fontSize="sm">League: {contest.league}</Text>
              <Text fontSize="sm">
                Event Time:{" "}
                {new Date(contest.eventTime * 1000).toLocaleString("en-US", {
                  hour12: true,
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
              </Text>
              <Text fontSize="sm">Status: {contest.contestStatus}</Text>
            </Box>
            <Divider my="2" />

            <Box lineHeight="tight" mb="2">
              <Text fontSize="sm" fontWeight="semibold" mb="1">
                Score Contest Source
              </Text>
              <Input
                type="file"
                accept=".js"
                onChange={(e) => handleFileUpload(e, setScoreContestSource)}
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
              onClick={scoreContest}
            >
              Score Contest
            </Button>
          </Box>
        </Box>
      </Flex>
    </>
  )
}
