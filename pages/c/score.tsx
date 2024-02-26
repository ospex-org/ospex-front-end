import type { NextPage } from "next"
import {
  Box,
  Flex,
  Text,
  Spacer,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import { Footer } from "../../components/Footer"
import { ScoreContestCard } from "../../components/ScoreContestCard"
import { contest } from "../../constants/interface"
import { useAdminQueryResults } from "../../hooks/useAdminQueryResults"
import { client } from "../../utils/apolloClient"
import { Header } from "../../components/Header"

const ScoreContest: NextPage = () => {
  const { adminContests } = useAdminQueryResults(client)
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()

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
            <ScoreContestCard
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
      <Header />
      <Flex justifyContent="center" alignItems="center" width="100%">
        <Box flexDirection="column" alignContent="center" mt="100px" textAlign="center">
          <Text
            textTransform="none"
            fontWeight="normal"
            fontSize="24px"
            pt={50}
            pb={1}
            color={useColorModeValue("black", "white")}
          >
            Score Contest
          </Text>
          <>{RenderCards()}</>
          <Spacer height="50px" />
        </Box>
        <Footer />
      </Flex>
    </>
  )
}

export default ScoreContest
