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
import { useEffect, useState } from "react"

type ContestCardState = {
  sourceOption: "default" | "custom"
  createContestSource: string
  useGithubSource: boolean
}

const ScoreContest: NextPage = () => {
  const { adminContests } = useAdminQueryResults(client)
  const [contestCardsState, setContestCardsState] = useState<Record<string, ContestCardState>>({})
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()

  useEffect(() => {
    // Transform adminContests into an object with unique keys for comparison
    const newContestsState = (adminContests as contest[]).reduce((acc, contest) => {
      const uniqueKey = contest.id
      acc[uniqueKey] = {
        sourceOption: "default",
        createContestSource: "",
        useGithubSource: true,
      }
      return acc
    }, {} as Record<string, ContestCardState>)

    // Only update state for contests that are new or changed
    setContestCardsState(prevState => {
      const updatedState = { ...prevState }
      Object.keys(newContestsState).forEach(key => {
        if (!prevState[key]) {
          // If the contest is new (not in the previous state), add it
          updatedState[key] = newContestsState[key]
        } else {
          // For existing contests, update only if there's a change
          // Re-assigns existing values to demonstrate the structure
          updatedState[key] = { ...prevState[key] }
        }
      })
      return updatedState
    })
    console.log("State updated with new or changed contests.")
  }, [adminContests])

  const updateContestCardState = (key: string, newState: ContestCardState) => {
    console.log(`State before update for key ${key}:`, contestCardsState[key])
    setContestCardsState(prevState => {
      const updatedState = { ...prevState, [key]: { ...prevState[key], ...newState } }
      console.log(`After update for key ${key}:`, updatedState[key])
      return updatedState
    })
  }

  const RenderCards = () => {
    return (
      <>
        {adminContests
          .filter((contest: contest) => contest.contestStatus === "Verified")
          .map((contest: contest) => (
            <ScoreContestCard
              key={contest.id}
              contest={contest}
              cardState={contestCardsState[contest.id]}
              updateCardState={(newState) => updateContestCardState(contest.id, newState)}
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
