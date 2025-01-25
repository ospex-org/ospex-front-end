import type { NextPage } from "next"
import {
  Box,
  Flex,
  Text,
  Spacer,
  useColorModeValue,
  useDisclosure,
  Center,
  Button
} from "@chakra-ui/react"
import { Footer } from "../../../components/Footer"
import { ScoreContestCardAlt } from "../../../components/alt/ScoreContestCardAlt"
import { contest } from "../../../constants/interface"
import { useAdminQueryResults } from "../../../hooks/useAdminQueryResults"
import { client } from "../../../utils/apolloClient"
import { Header } from "../../../components/Header"
import { TransactionStatusModal } from "../../../components/TransactionStatusModal"
import { useContext } from "react"
import { ProviderContext } from "../../../contexts/ProviderContext"
import { fetchCurrentScoreContestSourceFromGithubAlt } from "../../../scripts/fetchCurrentScoreContestSourceFromGithubAlt"
import { scoreContestAlt } from "../../../functions/alt/scoreContestAlt"

const ScoreContestAlt: React.FC = () => {
  const { adminContests } = useAdminQueryResults(client)
  const { provider, contestOracleResolvedContract, isWaiting, startWaiting, stopWaiting } = useContext(ProviderContext)
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()

  const handleTestScoreContest = async () => {
    try {
      const sourceCode = await fetchCurrentScoreContestSourceFromGithubAlt()
      scoreContestAlt(
        "1",
        "test123",
        sourceCode,
        startWaiting,
        stopWaiting,
        onModalOpen,
        onModalClose,
        provider,
        contestOracleResolvedContract,
        "test"
      )
    } catch (error) {
      console.error("Error in test score:", error)
    }
  }

  const RenderCards = () => {
    return (
      <>
        {adminContests
          .filter((contest: contest) => contest.contestStatus === "Verified")
          .filter((contest: contest) => {
            const fiveDaysInSeconds = 5 * 24 * 60 * 60
            const currentTimeInSeconds = Date.now() / 1000
            const timeSinceMatchStartInSeconds = currentTimeInSeconds - contest.eventTime
            return timeSinceMatchStartInSeconds <= fiveDaysInSeconds
          })
          .map((contest: contest) => (
            <ScoreContestCardAlt
              key={contest.id}
              contest={contest}
              onModalOpen={onModalOpen}
              onModalClose={onModalClose}
            />
          ))}
      </>
    )
  }

  return (
    <>
      <Flex direction="column" minH="100vh">
        <Header />
        <Box flex="1">
          <Center>
            <Flex direction="column" alignItems="center" w="100%" mt="100px">
              <Text
                textTransform="none"
                fontWeight="normal"
                fontSize="24px"
                pt={50}
                pb={5}
                color={useColorModeValue("black", "white")}
              >
                Score Contest
              </Text>
              <Button
                onClick={handleTestScoreContest}
                isLoading={isWaiting}
                disabled={!provider || isWaiting}
                mb={4}
              >
                Test Score Contest Hash
              </Button>
              <Center>
                <Flex direction="column" alignItems="center" w="100%">
                  {RenderCards()}
                  <Box>
                    <Spacer height="50px" />
                  </Box>
                </Flex>
              </Center>
              <Box mt="auto">
                <Footer />
              </Box>
            </Flex>
          </Center>
        </Box>
      </Flex>
      <TransactionStatusModal isOpen={isModalOpen} onClose={onModalClose} stopWaiting={stopWaiting} />
    </>
  )
}

export default ScoreContestAlt
