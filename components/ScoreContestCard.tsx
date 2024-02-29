import React, { useContext } from "react"
import { contest } from "../constants/interface"
import {
  Box,
  Flex,
  Button,
  Divider,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import { ProviderContext } from "../contexts/ProviderContext"
import { fetchCurrentScoreContestSourceFromGithub } from "../scripts/fetchCurrentScoreContestSourceFromGithub"
import { scoreContest } from "../functions/scoreContest"

interface ContestCardProps {
  contest: contest
  onModalOpen: () => void
  onModalClose: () => void
}

export const ScoreContestCard: React.FC<ContestCardProps> = ({
  contest, onModalOpen, onModalClose
}) => {
  const { provider, contestOracleResolvedContract, isWaiting, startWaiting, stopWaiting } = useContext(ProviderContext)
  const { colorMode } = useColorMode()

  const handleScoreContest = async (contest: contest) => {
    try {
      const sourceCode = await fetchCurrentScoreContestSourceFromGithub()
      scoreContest(contest.id, contest.jsonoddsId, sourceCode, startWaiting, stopWaiting, onModalOpen, onModalClose, provider, contestOracleResolvedContract)
    } catch (error) {
      console.error("Error fetching source code:", error)
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
          <Box p="4" textAlign="left">
            <Box lineHeight="tight" mb="2">
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
                  handleScoreContest(contest)
                }
              }}
            >
              Score Contest
            </Button>
          </Box>
        </Box>
      </Flex>
    </>
  )
}

